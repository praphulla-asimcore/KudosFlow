export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const { token, password } = body ?? {};

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired. Please request a new one.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });

    await logAuditEvent({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE',
      module: 'Auth',
      details: `Password reset completed for ${user.email}`,
    });

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (e: any) {
    console.error('Reset password error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
