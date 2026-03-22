export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { generatePDF } from '@/lib/pdf-generator';
import { generateDOCX } from '@/lib/docx-generator';
import type { DataEntryData } from '@/lib/document-types';

function buildDataEntryData(dataEntry: any, engagement: any): DataEntryData {
  const debtors = (dataEntry.debtorsCreditors || [])
    .filter((dc: any) => dc.type === 'Debtor')
    .map((dc: any) => ({ name: dc.name || '', amount: String(dc.amount || '0'), reference: dc.reference || '' }));
  const creditors = (dataEntry.debtorsCreditors || [])
    .filter((dc: any) => dc.type === 'Creditor')
    .map((dc: any) => ({ name: dc.name || '', amount: String(dc.amount || '0'), reference: dc.reference || '' }));
  const relatedParties = (dataEntry.relatedParties || [])
    .map((rp: any) => ({
      companyName: rp.companyName || '',
      relationship: rp.relationship || '',
      amount: String(rp.amount || '0'),
      nature: rp.natureOfTransaction || '',
    }));

  return {
    clientName: engagement.client?.companyName || '',
    companyNo: engagement.client?.registrationNo || '',
    fyEndDate: dataEntry.fyEndDate ? new Date(dataEntry.fyEndDate).toISOString() : '',
    auditPeriod: dataEntry.auditPeriod || '',
    registeredAddress: dataEntry.registeredAddress || '',
    businessAddress: dataEntry.businessAddress || '',
    engagementPartner: dataEntry.engagementPartner || '',
    managerInCharge: dataEntry.managerInCharge || '',
    director1Name: dataEntry.director1Name || '',
    director1Nric: dataEntry.director1Nric || '',
    director1Designation: dataEntry.director1Designation || '',
    director2Name: dataEntry.director2Name || '',
    director2Nric: dataEntry.director2Nric || '',
    director2Designation: dataEntry.director2Designation || '',
    bankName: dataEntry.bankName || '',
    accountNumber: dataEntry.accountNumber || '',
    bankBranch: dataEntry.bankBranch || '',
    balanceDate: dataEntry.balanceDate ? new Date(dataEntry.balanceDate).toISOString() : '',
    solicitorFirm: dataEntry.solicitorFirm || '',
    solicitorRef: dataEntry.solicitorRef || '',
    hpCompany: dataEntry.hpCompany || '',
    hpRef: dataEntry.hpRef || '',
    firmName: 'SBC & Co.',
    debtors,
    creditors,
    relatedParties,
  };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const engagementId = searchParams.get('engagementId');
    const documentType = searchParams.get('documentType');
    const format = searchParams.get('format') || 'pdf';

    if (!engagementId || !documentType) {
      return NextResponse.json({ error: 'engagementId and documentType required' }, { status: 400 });
    }

    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { client: true },
    });
    if (!engagement) return NextResponse.json({ error: 'Engagement not found' }, { status: 404 });

    const dataEntry = await prisma.dataEntry.findUnique({
      where: { engagementId },
      include: { debtorsCreditors: true, relatedParties: true },
    });
    if (!dataEntry) return NextResponse.json({ error: 'Data entry not found' }, { status: 404 });

    const data = buildDataEntryData(dataEntry, engagement);
    const safeDocType = documentType.replace(/[^a-zA-Z0-9]/g, '_');
    const safeName = (engagement.client?.companyName || 'doc').replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'docx') {
      const buffer = generateDOCX(documentType, data);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${safeDocType}_${safeName}_FY${engagement.financialYear}.docx"`,
        },
      });
    } else {
      const buffer = await generatePDF(documentType, data);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeDocType}_${safeName}_FY${engagement.financialYear}.pdf"`,
        },
      });
    }
  } catch (e: any) {
    console.error('Document download error:', e);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}
