export const DOCUMENT_TYPES = [
  'Engagement Letter',
  'Letter of Representation',
  'Bank Confirmation',
  'Debtor Confirmation',
  'Creditor Confirmation',
  'Related Party Confirmation',
  'Director Confirmation',
  'Solicitor Confirmation',
  'Hire Purchase Confirmation',
  'Inter-company Confirmation',
  'Corporate Guarantee Confirmation',
  'Management Representation Letter',
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number];

export interface DataEntryData {
  clientName: string;
  companyNo: string;
  fyEndDate: string;
  auditPeriod: string;
  registeredAddress: string;
  businessAddress: string;
  engagementPartner: string;
  managerInCharge: string;
  director1Name: string;
  director1Nric: string;
  director1Designation: string;
  director2Name: string;
  director2Nric: string;
  director2Designation: string;
  bankName: string;
  accountNumber: string;
  bankBranch: string;
  balanceDate: string;
  solicitorFirm: string;
  solicitorRef: string;
  hpCompany: string;
  hpRef: string;
  firmName: string;
  debtors: { name: string; amount: string; reference: string }[];
  creditors: { name: string; amount: string; reference: string }[];
  relatedParties: { companyName: string; relationship: string; amount: string; nature: string }[];
}

export function getDocumentContent(docType: string, data: DataEntryData): { title: string; body: string[] } {
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const fyDate = data.fyEndDate ? new Date(data.fyEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '[FY Date]';

  switch (docType) {
    case 'Engagement Letter':
      return {
        title: 'ENGAGEMENT LETTER',
        body: [
          `Date: ${date}`,
          '',
          `The Board of Directors`,
          `${data.clientName}`,
          `${data.registeredAddress}`,
          '',
          `Dear Sirs,`,
          '',
          `RE: AUDIT OF FINANCIAL STATEMENTS FOR THE FINANCIAL YEAR ENDED ${fyDate.toUpperCase()}`,
          '',
          `We are pleased to confirm our acceptance of the appointment as auditors of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}.`,
          '',
          `The objective of our audit is to express an opinion on the financial statements of the Company. We will conduct our audit in accordance with approved standards on auditing in Malaysia. Those standards require that we plan and perform the audit to obtain reasonable assurance about whether the financial statements are free of material misstatement.`,
          '',
          `An audit involves performing procedures to obtain audit evidence about the amounts and disclosures in the financial statements. The procedures selected depend on the auditor's judgment, including the assessment of risks of material misstatement of the financial statements, whether due to fraud or error.`,
          '',
          `Our audit will include obtaining an understanding of the entity and its environment, including its internal control, sufficient to identify and assess the risks of material misstatement.`,
          '',
          `The engagement will be led by ${data.engagementPartner} as the Engagement Partner, with ${data.managerInCharge} as the Manager in Charge.`,
          '',
          `We look forward to full cooperation from your staff during our audit.`,
          '',
          `Please sign and return the attached copy of this letter to indicate your acknowledgement and agreement.`,
          '',
          `Yours faithfully,`,
          `${data.firmName}`,
          '',
          '',
          `______________________________`,
          `${data.engagementPartner}`,
          `Engagement Partner`,
          '',
          '',
          `Acknowledged and agreed:`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
          `Date: _______________`,
        ],
      };

    case 'Letter of Representation':
      return {
        title: 'LETTER OF REPRESENTATION',
        body: [
          `Date: ${date}`,
          '',
          `${data.firmName}`,
          `Chartered Accountants`,
          '',
          `Dear Sirs,`,
          '',
          `RE: AUDIT OF FINANCIAL STATEMENTS OF ${data.clientName.toUpperCase()} FOR THE FINANCIAL YEAR ENDED ${fyDate.toUpperCase()}`,
          '',
          `This representation letter is provided in connection with your audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}, for the purpose of expressing an opinion as to whether the financial statements give a true and fair view in accordance with Malaysian Financial Reporting Standards.`,
          '',
          `We confirm, to the best of our knowledge and belief, having made such inquiries as we considered necessary for the purpose of appropriately informing ourselves:`,
          '',
          `1. We have fulfilled our responsibilities, as set out in the terms of the engagement letter, for the preparation of the financial statements in accordance with Malaysian Financial Reporting Standards.`,
          '',
          `2. We have provided you with access to all information of which we are aware that is relevant to the preparation of the financial statements.`,
          '',
          `3. All transactions have been recorded in the accounting records and are reflected in the financial statements.`,
          '',
          `4. We acknowledge our responsibility for the design, implementation and maintenance of internal control relevant to the preparation of financial statements that are free from material misstatement.`,
          '',
          `5. We have disclosed to you all known instances of non-compliance or suspected non-compliance with laws and regulations.`,
          '',
          `6. We have disclosed to you the identity of the entity's related parties and all related party relationships and transactions.`,
          '',
          '',
          `Yours faithfully,`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
          `${data.clientName}`,
        ],
      };

    case 'Bank Confirmation':
      return {
        title: 'BANK CONFIRMATION REQUEST',
        body: [
          `Date: ${date}`,
          '',
          `The Manager`,
          `${data.bankName}`,
          `${data.bankBranch}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: STANDARD BANK CONFIRMATION REQUEST — ${data.clientName.toUpperCase()} (COMPANY NO.: ${data.companyNo})`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} for the financial year ended ${fyDate}, please confirm directly to our auditors the following information as at the balance date of ${data.balanceDate ? new Date(data.balanceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '[Balance Date]'}:`,
          '',
          `Account Details:`,
          `Account Number: ${data.accountNumber}`,
          `Bank: ${data.bankName}`,
          `Branch: ${data.bankBranch}`,
          '',
          `Please confirm the following:`,
          `1. Account balance(s) as at the balance date`,
          `2. Details of any fixed deposits, including maturity dates and interest rates`,
          `3. Details of any outstanding loans, overdrafts or credit facilities`,
          `4. Details of any securities or charges held`,
          `5. Details of any guarantees given by or on behalf of the company`,
          '',
          `This request is made with the full knowledge and consent of the above-named company.`,
          '',
          `Please mail your reply directly to:`,
          `${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };

    case 'Debtor Confirmation': {
      const debtorLines = data.debtors.length > 0
        ? data.debtors.map((d, i) => `${i + 1}. ${d.name} — MYR ${d.amount} (Ref: ${d.reference})`)
        : ['[No debtors recorded]'];
      return {
        title: 'DEBTOR CONFIRMATION REQUEST',
        body: [
          `Date: ${date}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: CONFIRMATION OF BALANCE — ${data.clientName.toUpperCase()}`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}, we would be grateful if you could confirm directly to our auditors the amount owing by you to the above-named company as at ${fyDate}.`,
          '',
          `According to our records, the balance due from you as at the above date is as follows:`,
          '',
          ...debtorLines,
          '',
          `Please confirm whether the above balance is in agreement with your records. If it is not in agreement, please provide details of differences.`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };
    }

    case 'Creditor Confirmation': {
      const creditorLines = data.creditors.length > 0
        ? data.creditors.map((c, i) => `${i + 1}. ${c.name} — MYR ${c.amount} (Ref: ${c.reference})`)
        : ['[No creditors recorded]'];
      return {
        title: 'CREDITOR CONFIRMATION REQUEST',
        body: [
          `Date: ${date}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: CONFIRMATION OF BALANCE — ${data.clientName.toUpperCase()}`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}, we would be grateful if you could confirm directly to our auditors the amount owing to you by the above-named company as at ${fyDate}.`,
          '',
          `According to our records, the balance due to you as at the above date is as follows:`,
          '',
          ...creditorLines,
          '',
          `Please confirm whether the above balance is in agreement with your records. If it is not in agreement, please provide details of differences.`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };
    }

    case 'Related Party Confirmation': {
      const rpLines = data.relatedParties.length > 0
        ? data.relatedParties.map((rp, i) => `${i + 1}. ${rp.companyName} — Relationship: ${rp.relationship}, Amount: MYR ${rp.amount}, Nature: ${rp.nature}`)
        : ['[No related party transactions recorded]'];
      return {
        title: 'RELATED PARTY CONFIRMATION',
        body: [
          `Date: ${date}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: CONFIRMATION OF RELATED PARTY TRANSACTIONS — ${data.clientName.toUpperCase()}`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} for the financial year ended ${fyDate}, we request your confirmation of the following related party transactions:`,
          '',
          ...rpLines,
          '',
          `Please confirm that the above details are correct and complete. If there are any discrepancies, please provide the correct information.`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };
    }

    case 'Director Confirmation':
      return {
        title: 'DIRECTOR CONFIRMATION',
        body: [
          `Date: ${date}`,
          '',
          `${data.firmName}`,
          `Chartered Accountants`,
          '',
          `Dear Sirs,`,
          '',
          `RE: AUDIT OF ${data.clientName.toUpperCase()} — DIRECTOR CONFIRMATION FOR FY ENDED ${fyDate.toUpperCase()}`,
          '',
          `We, the undersigned Directors of ${data.clientName} (Company No.: ${data.companyNo}), hereby confirm the following in connection with the audit of the financial statements for the financial year ended ${fyDate}:`,
          '',
          `1. We have made available to you all books, records, supporting documentation, and other information requested for the purpose of the audit.`,
          '',
          `2. We have disclosed to you all significant facts relating to any fraud or suspected fraud that we are aware of involving management, employees, or others.`,
          '',
          `3. We have disclosed to you all known actual or possible litigation and claims whose effects should be considered in the financial statements.`,
          '',
          `4. The company has complied with all aspects of contractual agreements that could have a material effect on the financial statements.`,
          '',
          `5. We confirm that there are no material transactions that have not been properly recorded in the accounting records.`,
          '',
          '',
          `Director 1:`,
          `______________________________`,
          `${data.director1Name}`,
          `NRIC: ${data.director1Nric}`,
          `Designation: ${data.director1Designation}`,
          '',
          ...(data.director2Name ? [
            `Director 2:`,
            `______________________________`,
            `${data.director2Name}`,
            `NRIC: ${data.director2Nric}`,
            `Designation: ${data.director2Designation}`,
          ] : []),
          '',
          `Date: _______________`,
        ],
      };

    case 'Solicitor Confirmation':
      return {
        title: 'SOLICITOR CONFIRMATION REQUEST',
        body: [
          `Date: ${date}`,
          '',
          `${data.solicitorFirm || '[Solicitor Firm]'}`,
          `Ref: ${data.solicitorRef || '[Reference]'}`,
          '',
          `Dear Sirs,`,
          '',
          `RE: ${data.clientName.toUpperCase()} (COMPANY NO.: ${data.companyNo}) — REQUEST FOR INFORMATION`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} for the financial year ended ${fyDate}, we would be grateful if you could provide the following information directly to our auditors:`,
          '',
          `1. Details of any outstanding litigation, claims, or assessments involving the company`,
          `2. Your assessment of the likely outcome of such matters`,
          `3. An estimate of the financial implications, including costs`,
          `4. Details of any other matters that might have a material effect on the financial statements`,
          '',
          `This request is made with the full knowledge and consent of our client.`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };

    case 'Hire Purchase Confirmation':
      return {
        title: 'HIRE PURCHASE CONFIRMATION REQUEST',
        body: [
          `Date: ${date}`,
          '',
          `${data.hpCompany || '[HP Company]'}`,
          `Ref: ${data.hpRef || '[Reference]'}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: HIRE PURCHASE CONFIRMATION — ${data.clientName.toUpperCase()} (COMPANY NO.: ${data.companyNo})`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} for the financial year ended ${fyDate}, please confirm directly to our auditors the following information regarding hire purchase facilities granted to the above company:`,
          '',
          `1. Description and details of assets under hire purchase`,
          `2. Original hire purchase amount and date of agreement`,
          `3. Total amount outstanding as at ${fyDate}`,
          `4. Monthly installment amount`,
          `5. Interest rate applied`,
          `6. Any arrears or defaults as at ${fyDate}`,
          '',
          `This request is made with the full knowledge and consent of our client.`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };

    case 'Inter-company Confirmation':
      return {
        title: 'INTER-COMPANY CONFIRMATION',
        body: [
          `Date: ${date}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: INTER-COMPANY BALANCE CONFIRMATION — ${data.clientName.toUpperCase()}`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}, we request your confirmation of the inter-company balances and transactions between your company and the above-named company.`,
          '',
          `Please confirm the following:`,
          `1. Amount due from/to ${data.clientName} as at ${fyDate}`,
          `2. Details of inter-company transactions during the financial year`,
          `3. Any intercompany eliminations or adjustments required`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };

    case 'Corporate Guarantee Confirmation':
      return {
        title: 'CORPORATE GUARANTEE CONFIRMATION',
        body: [
          `Date: ${date}`,
          '',
          `Dear Sir/Madam,`,
          '',
          `RE: CONFIRMATION OF CORPORATE GUARANTEE — ${data.clientName.toUpperCase()}`,
          '',
          `In connection with the audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}, we request your confirmation of any corporate guarantees issued by or on behalf of the above company.`,
          '',
          `Please confirm the following:`,
          `1. Details of all corporate guarantees given by the company`,
          `2. The guaranteed party and amount of guarantee`,
          `3. Expiry date of the guarantee`,
          `4. Whether any claims have been made under the guarantee`,
          `5. Current status of each guarantee`,
          '',
          `Please send your reply directly to: ${data.firmName}`,
          '',
          `Yours faithfully,`,
          `For and on behalf of ${data.clientName}`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
        ],
      };

    case 'Management Representation Letter':
      return {
        title: 'MANAGEMENT REPRESENTATION LETTER',
        body: [
          `Date: ${date}`,
          '',
          `${data.firmName}`,
          `Chartered Accountants`,
          '',
          `Dear Sirs,`,
          '',
          `RE: MANAGEMENT REPRESENTATION — AUDIT OF ${data.clientName.toUpperCase()} FOR THE FINANCIAL YEAR ENDED ${fyDate.toUpperCase()}`,
          '',
          `This representation letter is provided in connection with your audit of the financial statements of ${data.clientName} (Company No.: ${data.companyNo}) for the financial year ended ${fyDate}.`,
          '',
          `We confirm to the best of our knowledge and belief:`,
          '',
          `1. Financial Statements: The financial statements are prepared in accordance with the Malaysian Financial Reporting Standards and give a true and fair view of the financial position and performance of the Company.`,
          '',
          `2. Completeness of Information: We have provided you with all relevant records and information. All material transactions have been properly recorded.`,
          '',
          `3. Fraud: We have disclosed any fraud or suspected fraud involving management, employees, or others that could have a material effect on the financial statements.`,
          '',
          `4. Compliance: The Company has complied with all applicable laws and regulations. We are not aware of any violations.`,
          '',
          `5. Subsequent Events: We have disclosed all events subsequent to the balance sheet date that require adjustment or disclosure.`,
          '',
          `6. Related Parties: We have disclosed all related party relationships, transactions, and balances.`,
          '',
          `7. Estimates: The methods, data, and significant assumptions used in making accounting estimates are reasonable.`,
          '',
          `8. Going Concern: The Company has the ability to continue as a going concern. We are not aware of any material uncertainties that may cast doubt on the Company's ability to continue as a going concern.`,
          '',
          '',
          `Yours faithfully,`,
          '',
          `______________________________`,
          `${data.director1Name}`,
          `${data.director1Designation}`,
          `${data.clientName}`,
          '',
          ...(data.director2Name ? [
            `______________________________`,
            `${data.director2Name}`,
            `${data.director2Designation}`,
            `${data.clientName}`,
          ] : []),
          '',
          `Date: _______________`,
        ],
      };

    default:
      return {
        title: docType.toUpperCase(),
        body: [
          `Date: ${date}`,
          '',
          `This document is generated for ${data.clientName} for the financial year ended ${fyDate}.`,
          '',
          `Prepared by: ${data.firmName}`,
        ],
      };
  }
}
