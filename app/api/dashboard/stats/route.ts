export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const totalClients = await prisma.client.count({ where: { status: 'active' } });
    const activeEngagements = await prisma.engagement.count({ where: { status: 'In Progress' } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docsToday = await prisma.auditTrail.count({
      where: { action: 'GENERATE', createdAt: { gte: today } },
    });
    
    const pendingDocs = await prisma.engagement.aggregate({
      _sum: { docsGeneratedCount: true },
      where: { status: 'In Progress' },
    });
    const totalPossible = activeEngagements * 12;
    const generated = pendingDocs?._sum?.docsGeneratedCount ?? 0;
    const pending = totalPossible - generated;

    return NextResponse.json({
      totalClients,
      activeEngagements,
      docsToday,
      pendingDocs: pending > 0 ? pending : 0,
    });
  } catch (e: any) {
    console.error('Dashboard stats error:', e);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
