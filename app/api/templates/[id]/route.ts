export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const template = await prisma.documentTemplate.findUnique({ where: { id: params?.id } });
    if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(template);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request?.json();
    const existing = await prisma.documentTemplate.findUnique({ where: { id: params?.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const template = await prisma.documentTemplate.update({
      where: { id: params?.id },
      data: {
        name: body?.name ?? existing.name,
        description: body?.description !== undefined ? body.description : existing.description,
        content: body?.content ?? existing.content,
        placeholders: body?.placeholders ? JSON.stringify(body.placeholders) : existing.placeholders,
        isActive: body?.isActive !== undefined ? body.isActive : existing.isActive,
        version: existing.version + 1,
      },
    });

    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'UPDATE', module: 'Templates', details: `Template updated: ${template?.name} (v${template?.version})` });
    return NextResponse.json(template);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.documentTemplate.findUnique({ where: { id: params?.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing?.isDefault) return NextResponse.json({ error: 'Cannot delete default templates' }, { status: 400 });

    await prisma.documentTemplate.delete({ where: { id: params?.id } });
    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'DELETE', module: 'Templates', details: `Template deleted: ${existing?.name}` });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
