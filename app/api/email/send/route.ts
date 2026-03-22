export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit-logger';
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session?.user as any;
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    const { to, cc, subject, htmlBody, documentIds } = body;
    if (!to || !subject || !documentIds?.length) {
      return NextResponse.json({ error: 'to, subject, and documentIds required' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' }, { status: 503 });
    }

    // Get documents and generate attachments
    const docs = await prisma.generatedDocument.findMany({
      where: { id: { in: documentIds } },
      include: {
        engagement: { include: { client: true } },
      },
    });

    if (docs.length === 0) {
      return NextResponse.json({ error: 'No documents found' }, { status: 404 });
    }

    const attachments: { filename: string; content: string }[] = [];

    for (const doc of docs) {
      const dataEntry = await prisma.dataEntry.findUnique({
        where: { engagementId: doc.engagementId },
        include: { debtorsCreditors: true, relatedParties: true },
      });
      if (!dataEntry) continue;

      const data = buildDataEntryData(dataEntry, doc.engagement);
      const safeType = doc.documentType.replace(/[^a-zA-Z0-9]/g, '_');

      try {
        const pdfBuffer = await generatePDF(doc.documentType, data);
        attachments.push({
          filename: `${safeType}_FY${doc.engagement.financialYear}.pdf`,
          content: pdfBuffer.toString('base64'),
        });
      } catch (e) { console.error('PDF gen error for email:', e); }

      try {
        const docxBuffer = generateDOCX(doc.documentType, data);
        attachments.push({
          filename: `${safeType}_FY${doc.engagement.financialYear}.docx`,
          content: docxBuffer.toString('base64'),
        });
      } catch (e) { console.error('DOCX gen error for email:', e); }
    }

    // Send via Resend
    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);

    const emailResult = await resend.emails.send({
      from: 'KudosFlow <onboarding@resend.dev>',
      to: [to],
      cc: cc?.filter(Boolean) || [],
      subject,
      html: htmlBody || body.body?.replace(/\n/g, '<br/>') || '',
      attachments: attachments.map(a => ({
        filename: a.filename,
        content: Buffer.from(a.content, 'base64'),
      })),
    });

    // Update document records
    for (const doc of docs) {
      await prisma.generatedDocument.update({
        where: { id: doc.id },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
          emailRecipient: to,
          emailSubject: subject,
        },
      });
    }

    const docTypes = docs.map(d => d.documentType).join(', ');
    const clientName = docs[0]?.engagement?.client?.companyName || 'Unknown';
    const fy = docs[0]?.engagement?.financialYear || '';

    await logAuditEvent({
      userId: user.id, userName: user.name,
      action: 'EMAIL', module: 'Documents',
      details: `${docTypes} sent to ${to} for ${clientName} FY${fy}`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, emailId: (emailResult as any)?.data?.id });
  } catch (e: any) {
    console.error('Email send error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to send email' }, { status: 500 });
  }
}
