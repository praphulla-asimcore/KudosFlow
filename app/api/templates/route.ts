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
    const templates = await prisma.documentTemplate.findMany({ orderBy: { documentType: 'asc' } });
    return NextResponse.json(templates);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request?.json();
    const template = await prisma.documentTemplate.create({
      data: {
        name: body?.name ?? '',
        documentType: body?.documentType ?? '',
        description: body?.description ?? null,
        content: body?.content ?? '',
        placeholders: body?.placeholders ? JSON.stringify(body.placeholders) : null,
        version: 1,
        isActive: body?.isActive ?? true,
        isDefault: false,
        createdById: user?.id ?? null,
      },
    });

    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'CREATE', module: 'Templates', details: `Template created: ${template?.name}` });
    return NextResponse.json(template, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
