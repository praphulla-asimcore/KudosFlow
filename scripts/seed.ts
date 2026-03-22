import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedAdmin = await bcrypt.hash('Asim@1212', 10);
  const hashedDefault = await bcrypt.hash('johndoe123', 10);
  const hashedDemo = await bcrypt.hash('Demo@1234', 10);

  // Admin user (required)
  const admin = await prisma.user.upsert({
    where: { email: 'praphulla@hexamatics.com' },
    update: {},
    create: {
      name: 'Praphulla',
      email: 'praphulla@hexamatics.com',
      password: hashedAdmin,
      role: 'Admin',
      status: 'active',
    },
  });

  // Default test account
  const defaultUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@doe.com',
      password: hashedDefault,
      role: 'Admin',
      status: 'active',
    },
  });

  // Demo users
  const partner = await prisma.user.upsert({
    where: { email: 'rashidah@kudos.my' },
    update: {},
    create: {
      name: 'Pn. Rashidah bt Ahmad',
      email: 'rashidah@kudos.my',
      password: hashedDemo,
      role: 'Partner',
      status: 'active',
    },
  });

  const senior = await prisma.user.upsert({
    where: { email: 'danial@kudos.my' },
    update: {},
    create: {
      name: 'En. Danial Hakim',
      email: 'danial@kudos.my',
      password: hashedDemo,
      role: 'Senior',
      status: 'active',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'hafiz@kudos.my' },
    update: {},
    create: {
      name: 'Hafiz Ismail',
      email: 'hafiz@kudos.my',
      password: hashedDemo,
      role: 'Staff',
      status: 'active',
    },
  });

  // Clients
  const client1 = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      companyName: 'Nexus Corp Sdn Bhd',
      registrationNo: '1234567-A',
      registeredAddress: 'Level 12, Nexus Tower, Jalan Sultan Ismail, 50250 Kuala Lumpur',
      businessAddress: 'Level 12, Nexus Tower, Jalan Sultan Ismail, 50250 Kuala Lumpur',
      industry: 'Technology',
      director1Name: 'En. Ahmad bin Razali',
      director1Nric: '700101-14-5678',
      director1Designation: 'Director',
      director2Name: 'Ms. Lee Siew Ling',
      director2Nric: '820505-10-1234',
      director2Designation: 'Director',
      contactName: 'En. Ahmad bin Razali',
      contactEmail: 'ahmad@nexuscorp.my',
      contactPhone: '+60 12-345 6789',
      status: 'active',
      createdById: admin.id,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      companyName: 'Pacific Traders Bhd',
      registrationNo: '9876543-B',
      registeredAddress: 'No. 8, Jalan Ampang, 50450 Kuala Lumpur',
      businessAddress: 'No. 8, Jalan Ampang, 50450 Kuala Lumpur',
      industry: 'Trading',
      director1Name: 'Tan Sri Wong Kah Yin',
      director1Nric: '650315-08-4321',
      director1Designation: 'Managing Director',
      contactName: 'Tan Sri Wong Kah Yin',
      contactEmail: 'wong@pacifictraders.my',
      contactPhone: '+60 3-2345 6789',
      status: 'active',
      createdById: admin.id,
    },
  });

  const client3 = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      companyName: 'Golden Gate Sdn Bhd',
      registrationNo: '5555555-C',
      registeredAddress: '22 Jalan Bukit Bintang, 55100 Kuala Lumpur',
      businessAddress: '22 Jalan Bukit Bintang, 55100 Kuala Lumpur',
      industry: 'Construction',
      director1Name: 'Mr. Rajesh Kumar',
      director1Nric: '780220-06-9876',
      director1Designation: 'Director',
      contactName: 'Mr. Rajesh Kumar',
      contactEmail: 'rajesh@goldengate.my',
      contactPhone: '+60 12-987 6543',
      status: 'active',
      createdById: admin.id,
    },
  });

  const client4 = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      companyName: 'Meridian Finance Bhd',
      registrationNo: '7777777-D',
      registeredAddress: 'Suite 15-01, Menara TM, 50672 Kuala Lumpur',
      industry: 'Finance',
      director1Name: 'Dato Sri Lim Wei Chen',
      director1Nric: '710430-02-5555',
      director1Designation: 'CEO',
      contactName: 'Dato Sri Lim Wei Chen',
      contactEmail: 'lim@meridianfinance.my',
      contactPhone: '+60 3-8765 4321',
      status: 'active',
      createdById: admin.id,
    },
  });

  const client5 = await prisma.client.upsert({
    where: { id: '00000000-0000-0000-0000-000000000005' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      companyName: 'Orchid Healthcare Sdn Bhd',
      registrationNo: '3333333-E',
      registeredAddress: '10 Jalan Hospital, 46000 Petaling Jaya',
      industry: 'Healthcare',
      director1Name: 'Dr. Siti Aminah',
      director1Nric: '800101-01-1111',
      director1Designation: 'Director',
      contactName: 'Dr. Siti Aminah',
      contactEmail: 'siti@orchidhealthcare.my',
      contactPhone: '+60 12-111 2222',
      status: 'archived',
      createdById: admin.id,
    },
  });

  // Engagements
  await prisma.engagement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      clientId: client1.id,
      financialYear: 2025,
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-12-31'),
      engagementType: 'Statutory Audit',
      partnerId: partner.id,
      managerId: senior.id,
      status: 'In Progress',
      docsGeneratedCount: 9,
    },
  });

  await prisma.engagement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000102' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      clientId: client1.id,
      financialYear: 2024,
      periodStart: new Date('2024-01-01'),
      periodEnd: new Date('2024-12-31'),
      engagementType: 'Statutory Audit',
      partnerId: partner.id,
      managerId: senior.id,
      status: 'Completed',
      docsGeneratedCount: 12,
    },
  });

  await prisma.engagement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000103' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000103',
      clientId: client2.id,
      financialYear: 2025,
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-12-31'),
      engagementType: 'Tax Compliance',
      partnerId: partner.id,
      managerId: senior.id,
      status: 'In Progress',
      docsGeneratedCount: 5,
    },
  });

  await prisma.engagement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000104' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000104',
      clientId: client3.id,
      financialYear: 2025,
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-12-31'),
      engagementType: 'Statutory Audit',
      partnerId: partner.id,
      managerId: senior.id,
      status: 'On Hold',
      docsGeneratedCount: 3,
    },
  });

  await prisma.engagement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000105' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000105',
      clientId: client4.id,
      financialYear: 2025,
      periodStart: new Date('2025-04-01'),
      periodEnd: new Date('2026-03-31'),
      engagementType: 'Review Engagement',
      partnerId: partner.id,
      managerId: senior.id,
      status: 'In Progress',
      docsGeneratedCount: 0,
    },
  });

  // Branding defaults
  await prisma.brandingSettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000901' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000901',
      firmName: 'Kudos & Associates',
      firmTagline: 'Chartered Accountants',
      firmAddress: 'Level 8, Menara KLCC, 50088 Kuala Lumpur',
      firmPhone: '+60 3-2171 0000',
      firmEmail: 'info@kudos.my',
      firmWebsite: 'www.kudos.my',
      primaryColor: '#0D1F29',
      accentColor: '#2A73E4',
      fontFamily: 'Inter',
      showLogoOnDocs: true,
      showAddressOnDocs: true,
      footerText: 'Kudos & Associates - Chartered Accountants | AF License No. 12345',
    },
  });

  // System settings
  const settingsData = [
    { id: '00000000-0000-0000-0000-000000000801', settingKey: 'company_name', settingValue: 'Kudos & Associates', category: 'general', label: 'Company Name', description: 'Firm display name' },
    { id: '00000000-0000-0000-0000-000000000802', settingKey: 'default_currency', settingValue: 'MYR', category: 'general', label: 'Default Currency', description: 'Default currency for documents' },
    { id: '00000000-0000-0000-0000-000000000803', settingKey: 'date_format', settingValue: 'DD/MM/YYYY', category: 'general', label: 'Date Format', description: 'Date display format' },
    { id: '00000000-0000-0000-0000-000000000804', settingKey: 'auto_save_interval', settingValue: '30', category: 'general', label: 'Auto-save Interval (sec)', description: 'Data entry auto-save interval in seconds' },
    { id: '00000000-0000-0000-0000-000000000805', settingKey: 'doc_output_format', settingValue: 'PDF', category: 'documents', label: 'Default Output Format', description: 'Default document output format (PDF/DOCX)' },
    { id: '00000000-0000-0000-0000-000000000806', settingKey: 'include_watermark', settingValue: 'false', category: 'documents', label: 'Include Watermark', description: 'Add DRAFT watermark on generated docs' },
    { id: '00000000-0000-0000-0000-000000000807', settingKey: 'email_notifications', settingValue: 'true', category: 'notifications', label: 'Email Notifications', description: 'Enable email notifications for doc generation' },
    { id: '00000000-0000-0000-0000-000000000808', settingKey: 'backup_frequency', settingValue: 'weekly', category: 'backup', label: 'Auto-backup Frequency', description: 'Automated backup schedule' },
  ];

  for (const s of settingsData) {
    await prisma.systemSettings.upsert({
      where: { settingKey: s.settingKey },
      update: {},
      create: s,
    });
  }

  // Default document templates
  const templateDefaults = [
    { id: '00000000-0000-0000-0000-000000000701', name: 'Engagement Letter', documentType: 'Engagement Letter', description: 'Standard engagement letter for statutory audit', isDefault: true, placeholders: JSON.stringify(['clientName','companyNo','fyEndDate','engagementPartner','registeredAddress']) },
    { id: '00000000-0000-0000-0000-000000000702', name: 'Bank Confirmation', documentType: 'Bank Confirmation', description: 'Bank balance confirmation request letter', isDefault: true, placeholders: JSON.stringify(['clientName','bankName','accountNumber','bankBranch','balanceDate']) },
    { id: '00000000-0000-0000-0000-000000000703', name: 'Debtor Confirmation', documentType: 'Debtor Confirmation', description: 'Debtor balance confirmation request', isDefault: true, placeholders: JSON.stringify(['clientName','debtorName','amount','balanceDate']) },
    { id: '00000000-0000-0000-0000-000000000704', name: 'Creditor Confirmation', documentType: 'Creditor Confirmation', description: 'Creditor balance confirmation request', isDefault: true, placeholders: JSON.stringify(['clientName','creditorName','amount','balanceDate']) },
    { id: '00000000-0000-0000-0000-000000000705', name: 'Director Confirmation', documentType: 'Director Confirmation', description: 'Director confirmation letter', isDefault: true, placeholders: JSON.stringify(['clientName','directorName','directorNric','fyEndDate']) },
    { id: '00000000-0000-0000-0000-000000000706', name: 'Solicitor Confirmation', documentType: 'Solicitor Confirmation', description: 'Solicitor confirmation for litigation/claims', isDefault: true, placeholders: JSON.stringify(['clientName','solicitorFirm','solicitorRef','fyEndDate']) },
  ];

  for (const t of templateDefaults) {
    await prisma.documentTemplate.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, content: `[Default ${t.documentType} template content - customize in Template Manager]`, version: 1, isActive: true },
    });
  }

  // Audit trail entries
  const auditEntries = [
    { userId: admin.id, userName: admin.name, action: 'LOGIN', module: 'Auth', details: 'Admin logged in', ipAddress: '192.168.1.1' },
    { userId: senior.id, userName: senior.name, action: 'GENERATE', module: 'Documents', details: 'Bank Confirmation generated for Nexus Corp Sdn Bhd', ipAddress: '192.168.1.2' },
    { userId: partner.id, userName: partner.name, action: 'CREATE', module: 'Engagements', details: 'Engagement created for Pacific Traders Bhd - FY2025', ipAddress: '192.168.1.3' },
    { userId: senior.id, userName: senior.name, action: 'GENERATE', module: 'Documents', details: 'Letter of Representation generated for Nexus Corp Sdn Bhd', ipAddress: '192.168.1.2' },
    { userId: admin.id, userName: admin.name, action: 'UPDATE', module: 'Templates', details: 'Engagement Letter template updated', ipAddress: '192.168.1.1' },
    { userId: partner.id, userName: partner.name, action: 'CREATE', module: 'Clients', details: 'New client added: Golden Gate Sdn Bhd', ipAddress: '192.168.1.3' },
    { userId: staff.id, userName: staff.name, action: 'GENERATE', module: 'Documents', details: 'Debtor Confirmation generated for Pacific Traders Bhd', ipAddress: '192.168.1.4' },
    { userId: senior.id, userName: senior.name, action: 'GENERATE', module: 'Documents', details: 'Director Confirmation generated for Nexus Corp Sdn Bhd', ipAddress: '192.168.1.2' },
    { userId: admin.id, userName: admin.name, action: 'UPDATE', module: 'Users', details: 'User role updated for Hafiz Ismail', ipAddress: '192.168.1.1' },
    { userId: partner.id, userName: partner.name, action: 'CREATE', module: 'Engagements', details: 'Engagement created for Meridian Finance Bhd - FY2025', ipAddress: '192.168.1.3' },
    { userId: senior.id, userName: senior.name, action: 'GENERATE', module: 'Documents', details: 'Solicitor Confirmation generated for Nexus Corp Sdn Bhd', ipAddress: '192.168.1.2' },
    { userId: staff.id, userName: staff.name, action: 'GENERATE', module: 'Documents', details: 'Corp. Guarantee generated for Golden Gate Sdn Bhd', ipAddress: '192.168.1.4' },
  ];

  for (const entry of auditEntries) {
    await prisma.auditTrail.create({ data: entry });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
