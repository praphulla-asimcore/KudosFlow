export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clients = await prisma.client.findMany({
      where: { status: 'active' },
      include: {
        engagements: {
          select: { docsGeneratedCount: true },
        },
      },
    });

    const mapped = clients?.map((c: any) => ({
      name: c?.companyName ?? 'Unknown',
      docs: (c?.engagements ?? []).reduce((sum: number, e: any) => sum + (e?.docsGeneratedCount ?? 0), 0),
    }))?.sort((a: any, b: any) => (b?.docs ?? 0) - (a?.docs ?? 0))?.slice(0, 5) ?? [];

    return NextResponse.json(mapped);
  } catch (e: any) {
    console.error('Top clients error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
