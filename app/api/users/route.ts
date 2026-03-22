export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const currentUser = session?.user as any;
    if (currentUser?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request?.json();
    if (!body?.email || !body?.name || !body?.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

    const hashed = await bcrypt.hash(body.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashed,
        role: body?.role ?? 'Staff',
        status: 'active',
      },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });

    await logAuditEvent({ userId: currentUser?.id, userName: currentUser?.name, action: 'CREATE', module: 'Users', details: `User created: ${newUser?.name} (${newUser?.role})` });
    return NextResponse.json(newUser, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
