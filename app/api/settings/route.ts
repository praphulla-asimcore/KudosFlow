export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const settings = await prisma.systemSettings.findMany({ orderBy: { category: 'asc' } });
    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request?.json();
    // body is an array of { settingKey, settingValue }
    const updates = body?.settings ?? [];
    for (const s of updates) {
      if (s?.settingKey && s?.settingValue !== undefined) {
        await prisma.systemSettings.update({
          where: { settingKey: s.settingKey },
          data: { settingValue: String(s.settingValue) },
        });
      }
    }

    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'UPDATE', module: 'Settings', details: `System settings updated (${updates?.length ?? 0} fields)` });
    const settings = await prisma.systemSettings.findMany({ orderBy: { category: 'asc' } });
    return NextResponse.json(settings);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
