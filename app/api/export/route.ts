export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    if (user?.role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request?.url ?? '');
    const type = searchParams?.get('type') ?? 'audit';

    let csvContent = '';
    if (type === 'audit') {
      const trails = await prisma.auditTrail.findMany({ orderBy: { createdAt: 'desc' }, take: 5000 });
      csvContent = 'Timestamp,User,Action,Module,Details,IP Address\n';
      for (const t of trails) {
        csvContent += `"${t?.createdAt?.toISOString() ?? ''}","${t?.userName ?? ''}","${t?.action ?? ''}","${t?.module ?? ''}","${(t?.details ?? '').replace(/"/g, '""')}","${t?.ipAddress ?? ''}"\n`;
      }
    } else if (type === 'clients') {
      const clients = await prisma.client.findMany({ orderBy: { companyName: 'asc' } });
      csvContent = 'Company Name,Registration No,Industry,Status,Contact Name,Contact Email,Contact Phone\n';
      for (const c of clients) {
        csvContent += `"${c?.companyName ?? ''}","${c?.registrationNo ?? ''}","${c?.industry ?? ''}","${c?.status ?? ''}","${c?.contactName ?? ''}","${c?.contactEmail ?? ''}","${c?.contactPhone ?? ''}"\n`;
      }
    } else if (type === 'users') {
      const users = await prisma.user.findMany({ select: { name: true, email: true, role: true, status: true, lastLogin: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
      csvContent = 'Name,Email,Role,Status,Last Login,Created At\n';
      for (const u of users) {
        csvContent += `"${u?.name ?? ''}","${u?.email ?? ''}","${u?.role ?? ''}","${u?.status ?? ''}","${u?.lastLogin?.toISOString() ?? 'Never'}","${u?.createdAt?.toISOString() ?? ''}"\n`;
      }
    } else {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'GENERATE', module: 'Export', details: `Data exported: ${type}` });
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="kudosflow-${type}-export.csv"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
