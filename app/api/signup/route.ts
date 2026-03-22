export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const { email, password, name, role } = body ?? {};
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: role ?? 'Staff' },
    });
    return NextResponse.json({ id: user?.id, email: user?.email, name: user?.name, role: user?.role });
  } catch (e: any) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
