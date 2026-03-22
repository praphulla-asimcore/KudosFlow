export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partners = await prisma.user.findMany({
      where: { role: 'Partner', status: 'active' },
      select: { id: true, name: true },
    });
    const seniors = await prisma.user.findMany({
      where: { role: 'Senior', status: 'active' },
      select: { id: true, name: true },
    });

    const admins = await prisma.user.findMany({
      where: { role: 'Admin', status: 'active' },
      select: { id: true, name: true },
    });
    const staff = await prisma.user.findMany({
      where: { role: 'Staff', status: 'active' },
      select: { id: true, name: true },
    });

    return NextResponse.json({ partners: partners ?? [], seniors: seniors ?? [], admins: admins ?? [], staff: staff ?? [] });
  } catch (e: any) {
    console.error('Partners/Seniors error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
