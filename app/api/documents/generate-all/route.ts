export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';
import { DOCUMENT_TYPES } from '@/lib/document-types';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { engagementId } = body;

    if (!engagementId) return NextResponse.json({ error: 'engagementId required' }, { status: 400 });

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { client: true },
    });
    if (!engagement) return NextResponse.json({ error: 'Engagement not found' }, { status: 404 });

    const dataEntry = await prisma.dataEntry.findUnique({ where: { engagementId } });
    if (!dataEntry) return NextResponse.json({ error: 'Data entry not found' }, { status: 404 });

    const results = [];
    for (const docType of DOCUMENT_TYPES) {
      const existing = await prisma.generatedDocument.findFirst({
        where: { engagementId, documentType: docType },
      });

      if (existing) {
        await prisma.generatedDocument.update({
          where: { id: existing.id },
          data: { generatedById: user.id, generatedAt: new Date() },
        });
        results.push(existing.id);
      } else {
        const doc = await prisma.generatedDocument.create({
          data: {
            engagementId,
            clientId: engagement.clientId,
            documentType: docType,
            generatedById: user.id,
          },
        });
        results.push(doc.id);
      }
    }

    await prisma.engagement.update({
      where: { id: engagementId },
      data: { docsGeneratedCount: 12 },
    });

    await logAuditEvent({
      userId: user.id, userName: user.name,
      action: 'GENERATE', module: 'Documents',
      details: `All 12 documents generated for ${engagement.client.companyName} FY${engagement.financialYear}`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, count: results.length });
  } catch (e: any) {
    console.error('Generate all error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
