export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const engagement = await prisma.engagement.findUnique({
      where: { id: params?.id },
      include: {
        client: true,
        partner: { select: { id: true, name: true } },
        manager: { select: { id: true, name: true } },
      },
    });
    if (!engagement) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      ...engagement,
      periodStart: engagement.periodStart?.toISOString() ?? null,
      periodEnd: engagement.periodEnd?.toISOString() ?? null,
      createdAt: engagement.createdAt?.toISOString(),
      updatedAt: engagement.updatedAt?.toISOString(),
    });
  } catch (e: any) {
    console.error('Engagement GET error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request?.json();
    const ip = request?.headers?.get('x-forwarded-for') ?? 'unknown';

    const data: any = {};
    if (body?.financialYear !== undefined) data.financialYear = parseInt(body.financialYear);
    if (body?.periodStart !== undefined) data.periodStart = body.periodStart ? new Date(body.periodStart) : null;
    if (body?.periodEnd !== undefined) data.periodEnd = body.periodEnd ? new Date(body.periodEnd) : null;
    if (body?.engagementType !== undefined) data.engagementType = body.engagementType;
    if (body?.partnerId !== undefined) data.partnerId = body.partnerId;
    if (body?.managerId !== undefined) data.managerId = body.managerId;
    if (body?.status !== undefined) data.status = body.status;

    const updated = await prisma.engagement.update({
      where: { id: params?.id },
      data,
    });

    await logAuditEvent({
      userId: user?.id, userName: user?.name,
      action: 'UPDATE', module: 'Engagements',
      details: `Engagement updated: FY${updated?.financialYear ?? ''}`,
      ipAddress: ip,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Engagement update error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
