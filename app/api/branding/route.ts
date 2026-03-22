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
    let branding = await prisma.brandingSettings.findFirst();
    if (!branding) {
      branding = await prisma.brandingSettings.create({
        data: { firmName: 'Kudos & Associates' },
      });
    }
    return NextResponse.json(branding);
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
    let branding = await prisma.brandingSettings.findFirst();

    if (branding) {
      branding = await prisma.brandingSettings.update({
        where: { id: branding.id },
        data: {
          firmName: body?.firmName ?? branding.firmName,
          firmTagline: body?.firmTagline !== undefined ? body.firmTagline : branding.firmTagline,
          firmAddress: body?.firmAddress !== undefined ? body.firmAddress : branding.firmAddress,
          firmPhone: body?.firmPhone !== undefined ? body.firmPhone : branding.firmPhone,
          firmEmail: body?.firmEmail !== undefined ? body.firmEmail : branding.firmEmail,
          firmWebsite: body?.firmWebsite !== undefined ? body.firmWebsite : branding.firmWebsite,
          logoBase64: body?.logoBase64 !== undefined ? body.logoBase64 : branding.logoBase64,
          primaryColor: body?.primaryColor ?? branding.primaryColor,
          accentColor: body?.accentColor ?? branding.accentColor,
          fontFamily: body?.fontFamily ?? branding.fontFamily,
          showLogoOnDocs: body?.showLogoOnDocs !== undefined ? body.showLogoOnDocs : branding.showLogoOnDocs,
          showAddressOnDocs: body?.showAddressOnDocs !== undefined ? body.showAddressOnDocs : branding.showAddressOnDocs,
          footerText: body?.footerText !== undefined ? body.footerText : branding.footerText,
        },
      });
    } else {
      branding = await prisma.brandingSettings.create({ data: body });
    }

    await logAuditEvent({ userId: user?.id, userName: user?.name, action: 'UPDATE', module: 'Branding', details: 'Branding settings updated' });
    return NextResponse.json(branding);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
