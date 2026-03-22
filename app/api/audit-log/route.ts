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
    const user = session?.user as any;
    if (!['Admin', 'Partner'].includes(user?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request?.url ?? '');
    const action = searchParams?.get('action') ?? undefined;
    const module_ = searchParams?.get('module') ?? undefined;
    const search = searchParams?.get('search') ?? undefined;
    const page = parseInt(searchParams?.get('page') ?? '1');
    const limit = parseInt(searchParams?.get('limit') ?? '50');

    const where: any = {};
    if (action && action !== 'All') where.action = action;
    if (module_ && module_ !== 'All') where.module = module_;
    if (search?.trim()) {
      where.OR = [
        { details: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, trails] = await Promise.all([
      prisma.auditTrail.count({ where }),
      prisma.auditTrail.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({ data: trails, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request?.json();
    await logAuditEvent({
      userId: user?.id,
      userName: user?.name,
      action: body?.action ?? 'UPDATE',
      module: body?.module ?? '',
      details: body?.details ?? '',
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
