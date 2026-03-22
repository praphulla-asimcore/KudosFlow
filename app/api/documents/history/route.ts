export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const documentType = searchParams.get('documentType');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (documentType) where.documentType = documentType;
    if (userId) where.generatedById = userId;

    const docs = await prisma.generatedDocument.findMany({
      where,
      include: {
        client: { select: { id: true, companyName: true } },
        engagement: { select: { id: true, financialYear: true } },
        generatedBy: { select: { id: true, name: true } },
      },
      orderBy: { generatedAt: 'desc' },
      take: 200,
    });

    return NextResponse.json(docs);
  } catch (e: any) {
    console.error('History GET error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
