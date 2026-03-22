export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const activities = await prisma.auditTrail.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formatted = activities?.map((a: any) => ({
      id: a?.id,
      userName: a?.userName ?? 'System',
      action: a?.action ?? 'UNKNOWN',
      module: a?.module ?? '',
      details: a?.details ?? '',
      createdAt: a?.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })) ?? [];

    return NextResponse.json(formatted);
  } catch (e: any) {
    console.error('Activity fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
