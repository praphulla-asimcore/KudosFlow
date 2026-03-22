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

    const client = await prisma.client.findUnique({
      where: { id: params?.id },
      include: {
        engagements: {
          include: {
            partner: { select: { id: true, name: true } },
            manager: { select: { id: true, name: true } },
          },
          orderBy: { financialYear: 'desc' },
        },
      },
    });
    if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const formatted = {
      ...client,
      createdAt: client?.createdAt?.toISOString?.(),
      updatedAt: client?.updatedAt?.toISOString?.(),
      engagements: client?.engagements?.map((e: any) => ({
        ...e,
        periodStart: e?.periodStart?.toISOString?.() ?? null,
        periodEnd: e?.periodEnd?.toISOString?.() ?? null,
        createdAt: e?.createdAt?.toISOString?.(),
        updatedAt: e?.updatedAt?.toISOString?.(),
      })) ?? [],
    };

    return NextResponse.json(formatted);
  } catch (e: any) {
    console.error('Client GET error:', e);
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

    const updated = await prisma.client.update({
      where: { id: params?.id },
      data: {
        companyName: body?.companyName,
        registrationNo: body?.registrationNo,
        registeredAddress: body?.registeredAddress,
        businessAddress: body?.sameAsRegistered ? body?.registeredAddress : body?.businessAddress,
        industry: body?.industry,
        director1Name: body?.director1Name,
        director1Nric: body?.director1Nric,
        director1Designation: body?.director1Designation,
        director2Name: body?.director2Name,
        director2Nric: body?.director2Nric,
        director2Designation: body?.director2Designation,
        contactName: body?.contactName,
        contactEmail: body?.contactEmail,
        contactPhone: body?.contactPhone,
        status: body?.status,
      },
    });

    await logAuditEvent({
      userId: user?.id, userName: user?.name,
      action: 'UPDATE', module: 'Clients',
      details: `Client updated: ${body?.companyName ?? 'Unknown'}`,
      ipAddress: ip,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Client update error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
