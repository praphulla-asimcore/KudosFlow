export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request?.json();
    const ip = request?.headers?.get('x-forwarded-for') ?? 'unknown';

    const engagement = await prisma.engagement.create({
      data: {
        clientId: body?.clientId,
        financialYear: parseInt(body?.financialYear ?? '2025'),
        periodStart: body?.periodStart ? new Date(body.periodStart) : null,
        periodEnd: body?.periodEnd ? new Date(body.periodEnd) : null,
        engagementType: body?.engagementType ?? null,
        partnerId: body?.partnerId ?? null,
        managerId: body?.managerId ?? null,
      },
    });

    await logAuditEvent({
      userId: user?.id, userName: user?.name,
      action: 'CREATE', module: 'Engagements',
      details: `Engagement created for FY${body?.financialYear ?? ''}`,
      ipAddress: ip,
    });

    return NextResponse.json(engagement);
  } catch (e: any) {
    console.error('Engagement create error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
