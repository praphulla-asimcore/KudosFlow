export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const email = body?.email?.trim()?.toLowerCase();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user || user.status !== 'active') {
      return NextResponse.json({ success: true, message: 'If an account exists with that email, a reset link has been generated.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await logAuditEvent({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE',
      module: 'Auth',
      details: `Password reset requested for ${email}`,
    });

    // Return token in response for internal use (no email service configured)
    // In production with email, this would send an email instead
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a reset link has been generated.',
      // For internal tool: provide the reset link directly
      resetLink: `/reset-password?token=${resetToken}`,
    });
  } catch (e: any) {
    console.error('Forgot password error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
