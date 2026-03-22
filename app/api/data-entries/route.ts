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
    const { searchParams } = new URL(request.url);
    const engagementId = searchParams.get('engagementId');
    if (!engagementId) return NextResponse.json({ error: 'engagementId required' }, { status: 400 });

    const dataEntry = await prisma.dataEntry.findUnique({
      where: { engagementId },
      include: {
        debtorsCreditors: true,
        relatedParties: true,
        engagement: {
          include: {
            client: true,
            partner: { select: { id: true, name: true } },
            manager: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(dataEntry);
  } catch (e: any) {
    console.error('Data entry GET error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    const existing = await prisma.dataEntry.findUnique({ where: { engagementId: body.engagementId } });
    if (existing) {
      return NextResponse.json({ error: 'Data entry already exists for this engagement. Use PUT to update.' }, { status: 409 });
    }

    const dataEntry = await prisma.dataEntry.create({
      data: {
        engagementId: body.engagementId,
        clientId: body.clientId,
        fyEndDate: body.fyEndDate ? new Date(body.fyEndDate) : null,
        auditPeriod: body.auditPeriod,
        registeredAddress: body.registeredAddress,
        businessAddress: body.businessAddress,
        engagementPartner: body.engagementPartner,
        managerInCharge: body.managerInCharge,
        director1Name: body.director1Name,
        director1Nric: body.director1Nric,
        director1Designation: body.director1Designation,
        director2Name: body.director2Name,
        director2Nric: body.director2Nric,
        director2Designation: body.director2Designation,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        bankBranch: body.bankBranch,
        balanceDate: body.balanceDate ? new Date(body.balanceDate) : null,
        solicitorFirm: body.solicitorFirm,
        solicitorRef: body.solicitorRef,
        hpCompany: body.hpCompany,
        hpRef: body.hpRef,
        isLocked: body.isLocked ?? false,
        createdById: user.id,
      },
      include: { debtorsCreditors: true, relatedParties: true },
    });

    // Create debtors/creditors
    if (body.debtorsCreditors?.length > 0) {
      await prisma.debtorCreditor.createMany({
        data: body.debtorsCreditors.map((dc: any) => ({
          dataEntryId: dataEntry.id,
          name: dc.name,
          amount: dc.amount ? parseFloat(dc.amount) : null,
          type: dc.type,
          reference: dc.reference,
        })),
      });
    }

    // Create related parties
    if (body.relatedParties?.length > 0) {
      await prisma.relatedParty.createMany({
        data: body.relatedParties.map((rp: any) => ({
          dataEntryId: dataEntry.id,
          companyName: rp.companyName,
          relationship: rp.relationship,
          amount: rp.amount ? parseFloat(rp.amount) : null,
          natureOfTransaction: rp.natureOfTransaction,
        })),
      });
    }

    await logAuditEvent({
      userId: user.id, userName: user.name,
      action: 'CREATE', module: 'Data Entry',
      details: `Data entry created for engagement ${body.engagementId}`,
      ipAddress: ip,
    });

    const full = await prisma.dataEntry.findUnique({
      where: { id: dataEntry.id },
      include: { debtorsCreditors: true, relatedParties: true },
    });

    return NextResponse.json(full);
  } catch (e: any) {
    console.error('Data entry POST error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    const existing = await prisma.dataEntry.findUnique({ where: { engagementId: body.engagementId } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const dataEntry = await prisma.dataEntry.update({
      where: { engagementId: body.engagementId },
      data: {
        fyEndDate: body.fyEndDate ? new Date(body.fyEndDate) : null,
        auditPeriod: body.auditPeriod,
        registeredAddress: body.registeredAddress,
        businessAddress: body.businessAddress,
        engagementPartner: body.engagementPartner,
        managerInCharge: body.managerInCharge,
        director1Name: body.director1Name,
        director1Nric: body.director1Nric,
        director1Designation: body.director1Designation,
        director2Name: body.director2Name,
        director2Nric: body.director2Nric,
        director2Designation: body.director2Designation,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        bankBranch: body.bankBranch,
        balanceDate: body.balanceDate ? new Date(body.balanceDate) : null,
        solicitorFirm: body.solicitorFirm,
        solicitorRef: body.solicitorRef,
        hpCompany: body.hpCompany,
        hpRef: body.hpRef,
        isLocked: body.isLocked ?? existing.isLocked,
      },
    });

    // Replace debtors/creditors
    await prisma.debtorCreditor.deleteMany({ where: { dataEntryId: dataEntry.id } });
    if (body.debtorsCreditors?.length > 0) {
      await prisma.debtorCreditor.createMany({
        data: body.debtorsCreditors.map((dc: any) => ({
          dataEntryId: dataEntry.id,
          name: dc.name,
          amount: dc.amount ? parseFloat(dc.amount) : null,
          type: dc.type,
          reference: dc.reference,
        })),
      });
    }

    // Replace related parties
    await prisma.relatedParty.deleteMany({ where: { dataEntryId: dataEntry.id } });
    if (body.relatedParties?.length > 0) {
      await prisma.relatedParty.createMany({
        data: body.relatedParties.map((rp: any) => ({
          dataEntryId: dataEntry.id,
          companyName: rp.companyName,
          relationship: rp.relationship,
          amount: rp.amount ? parseFloat(rp.amount) : null,
          natureOfTransaction: rp.natureOfTransaction,
        })),
      });
    }

    await logAuditEvent({
      userId: user.id, userName: user.name,
      action: 'UPDATE', module: 'Data Entry',
      details: `Data entry updated for engagement ${body.engagementId}`,
      ipAddress: ip,
    });

    const full = await prisma.dataEntry.findUnique({
      where: { id: dataEntry.id },
      include: { debtorsCreditors: true, relatedParties: true },
    });

    return NextResponse.json(full);
  } catch (e: any) {
    console.error('Data entry PUT error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
