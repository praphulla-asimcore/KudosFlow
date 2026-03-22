export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';
import type { DataEntryData } from '@/lib/document-types';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { engagementId, documentType } = body;

    if (!engagementId || !documentType) {
      return NextResponse.json({ error: 'engagementId and documentType required' }, { status: 400 });
    }

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { client: true, partner: true, manager: true },
    });
    if (!engagement) return NextResponse.json({ error: 'Engagement not found' }, { status: 404 });

    const dataEntry = await prisma.dataEntry.findUnique({
      where: { engagementId },
      include: { debtorsCreditors: true, relatedParties: true },
    });
    if (!dataEntry) return NextResponse.json({ error: 'Data entry not found. Please complete data entry first.' }, { status: 404 });

    // Upsert generated document record
    const existing = await prisma.generatedDocument.findFirst({
      where: { engagementId, documentType },
    });

    let doc;
    if (existing) {
      doc = await prisma.generatedDocument.update({
        where: { id: existing.id },
        data: { generatedById: user.id, generatedAt: new Date() },
      });
    } else {
      doc = await prisma.generatedDocument.create({
        data: {
          engagementId,
          clientId: engagement.clientId,
          documentType,
          generatedById: user.id,
        },
      });
    }

    // Update engagement docs count
    const docsCount = await prisma.generatedDocument.count({ where: { engagementId } });
    await prisma.engagement.update({
      where: { id: engagementId },
      data: { docsGeneratedCount: docsCount },
    });

    await logAuditEvent({
      userId: user.id, userName: user.name,
      action: 'GENERATE', module: 'Documents',
      details: `${documentType} generated for ${engagement.client.companyName} FY${engagement.financialYear}`,
      ipAddress: ip,
    });

    return NextResponse.json(doc);
  } catch (e: any) {
    console.error('Document generate error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
