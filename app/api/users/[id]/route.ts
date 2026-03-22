export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const currentUser = session?.user as any;
    if (currentUser?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request?.json();
    const existing = await prisma.user.findUnique({ where: { id: params?.id } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data: any = {};
    if (body?.name) data.name = body.name;
    if (body?.email && body.email !== existing.email) {
      const dup = await prisma.user.findUnique({ where: { email: body.email } });
      if (dup) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      data.email = body.email;
    }
    if (body?.role) data.role = body.role;
    if (body?.status) data.status = body.status;
    if (body?.password) data.password = await bcrypt.hash(body.password, 10);

    const updated = await prisma.user.update({
      where: { id: params?.id },
      data,
      select: { id: true, name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true },
    });

    const changes = Object.keys(data).filter(k => k !== 'password').join(', ');
    await logAuditEvent({ userId: currentUser?.id, userName: currentUser?.name, action: 'UPDATE', module: 'Users', details: `User updated: ${updated?.name} (${changes || 'password reset'})` });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
