export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(request?.url ?? '');
    const status = searchParams?.get('status') ?? undefined;
    const search = searchParams?.get('search') ?? undefined;

    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { registrationNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      include: { _count: { select: { engagements: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const counts = {
      all: await prisma.client.count(),
      active: await prisma.client.count({ where: { status: 'active' } }),
      archived: await prisma.client.count({ where: { status: 'archived' } }),
    };

    const formatted = clients?.map((c: any) => ({
      id: c?.id,
      companyName: c?.companyName,
      registrationNo: c?.registrationNo,
      registeredAddress: c?.registeredAddress,
      businessAddress: c?.businessAddress,
      industry: c?.industry,
      director1Name: c?.director1Name,
      director1Nric: c?.director1Nric,
      director1Designation: c?.director1Designation,
      director2Name: c?.director2Name,
      director2Nric: c?.director2Nric,
      director2Designation: c?.director2Designation,
      contactName: c?.contactName,
      contactEmail: c?.contactEmail,
      contactPhone: c?.contactPhone,
      status: c?.status,
      engagementCount: c?._count?.engagements ?? 0,
      createdAt: c?.createdAt?.toISOString?.(),
    })) ?? [];

    return NextResponse.json({ clients: formatted, counts });
  } catch (e: any) {
    console.error('Clients GET error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request?.json();
    const ip = request?.headers?.get('x-forwarded-for') ?? 'unknown';

    const client = await prisma.client.create({
      data: {
        companyName: body?.companyName ?? '',
        registrationNo: body?.registrationNo ?? null,
        registeredAddress: body?.registeredAddress ?? null,
        businessAddress: body?.sameAsRegistered ? body?.registeredAddress : (body?.businessAddress ?? null),
        industry: body?.industry ?? null,
        director1Name: body?.director1Name ?? null,
        director1Nric: body?.director1Nric ?? null,
        director1Designation: body?.director1Designation ?? 'Director',
        director2Name: body?.director2Name ?? null,
        director2Nric: body?.director2Nric ?? null,
        director2Designation: body?.director2Designation ?? null,
        contactName: body?.contactName ?? null,
        contactEmail: body?.contactEmail ?? null,
        contactPhone: body?.contactPhone ?? null,
        createdById: user?.id ?? null,
      },
    });

    await logAuditEvent({
      userId: user?.id, userName: user?.name,
      action: 'CREATE', module: 'Clients',
      details: `New client added: ${body?.companyName ?? 'Unknown'}`,
      ipAddress: ip,
    });

    return NextResponse.json(client);
  } catch (e: any) {
    console.error('Client create error:', e);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
