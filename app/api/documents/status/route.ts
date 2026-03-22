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
    const engagementId = searchParams.get('engagementId');
    if (!engagementId) return NextResponse.json({ error: 'engagementId required' }, { status: 400 });

    const docs = await prisma.generatedDocument.findMany({
      where: { engagementId },
      select: {
        id: true,
        documentType: true,
        generatedAt: true,
        emailSent: true,
        emailSentAt: true,
        emailRecipient: true,
      },
      orderBy: { documentType: 'asc' },
    });

    return NextResponse.json(docs);
  } catch (e: any) {
    console.error('Document status error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
