'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { FileText, Download, Mail, Check, Clock, Loader2, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DOCUMENT_TYPES = [
  'Engagement Letter', 'Letter of Representation', 'Bank Confirmation',
  'Debtor Confirmation', 'Creditor Confirmation', 'Related Party Confirmation',
  'Director Confirmation', 'Solicitor Confirmation', 'Hire Purchase Confirmation',
  'Inter-company Confirmation', 'Corporate Guarantee Confirmation', 'Management Representation Letter',
];

interface DocStatus {
  id: string;
  documentType: string;
  generatedAt: string;
  emailSent: boolean;
  emailSentAt?: string;
  emailRecipient?: string;
}

export default function DocumentGeneratorPage() {
  const params = useParams();
  const router = useRouter();
  const engagementId = params?.engagementId as string;
  const [loading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [docStatuses, setDocStatuses] = useState<DocStatus[]>([]);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [generatingAll, setGeneratingAll] = useState(false);
  const [genAllProgress, setGenAllProgress] = useState(0);
  const [genAllCurrent, setGenAllCurrent] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDocType, setEmailDocType] = useState('');
  const [emailForm, setEmailForm] = useState({ to: '', cc: '', subject: '', body: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedForEmail, setSelectedForEmail] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      const engRes = await fetch(`/api/engagements/${engagementId}`);
      if (!engRes.ok) { setLoading(false); return; }
      const engData = await engRes.json();
      setEngagement(engData);

      const clientRes = await fetch(`/api/clients/${engData.clientId}`);
      if (clientRes.ok) setClient(await clientRes.json());

      const statusRes = await fetch(`/api/documents/status?engagementId=${engagementId}`);
      if (statusRes.ok) setDocStatuses(await statusRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [engagementId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDocStatus = (docType: string) => docStatuses.find(d => d.documentType === docType);

  const handleGenerate = async (docType: string) => {
    setGenerating(prev => ({ ...prev, [docType]: true }));
    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engagementId, documentType: docType }),
      });
      if (res.ok) {
        toast.success(`${docType} generated`);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err?.error || 'Generation failed');
      }
    } catch { toast.error('Error'); }
    finally { setGenerating(prev => ({ ...prev, [docType]: false })); }
  };

  const handleGenerateAll = async () => {
    setGeneratingAll(true);
    setGenAllProgress(0);
    try {
      for (let i = 0; i < DOCUMENT_TYPES.length; i++) {
        setGenAllCurrent(DOCUMENT_TYPES[i]);
        await fetch('/api/documents/generate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ engagementId, documentType: DOCUMENT_TYPES[i] }),
        });
        setGenAllProgress(i + 1);
      }
      toast.success('All 12 documents generated!');
      fetchData();
    } catch { toast.error('Error generating documents'); }
    finally { setGeneratingAll(false); }
  };

  const handleDownload = async (docType: string, format: 'pdf' | 'docx') => {
    const key = `${docType}-${format}`;
    setDownloading(prev => ({ ...prev, [key]: true }));
    try {
      const url = `/api/documents/download?engagementId=${engagementId}&documentType=${encodeURIComponent(docType)}&format=${format}`;
      const res = await fetch(url);
      if (!res.ok) { toast.error('Download failed'); return; }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${docType.replace(/[^a-zA-Z0-9]/g, '_')}_FY${engagement?.financialYear}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch { toast.error('Download error'); }
    finally { setDownloading(prev => ({ ...prev, [key]: false })); }
  };

  const openEmailModal = (docType: string) => {
    const status = getDocStatus(docType);
    if (!status) return;
    setEmailDocType(docType);
    setSelectedForEmail([status.id]);
    const fy = engagement?.financialYear || '';
    const cn = client?.companyName || '';
    const fyDate = engagement?.periodEnd ? new Date(engagement.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
    setEmailForm({
      to: client?.contactEmail || '',
      cc: '',
      subject: `${docType} — ${cn} FY${fy}`,
      body: `Dear Sir/Madam,\n\nPlease find attached the ${docType} for ${cn} for the financial year ended ${fyDate}.\n\nKindly acknowledge receipt and confirm the details.\n\nRegards,\nSBC & Co. | KudosFlow`,
    });
    setShowEmailModal(true);
  };

  const openBulkEmail = () => {
    const selectedDocs = docStatuses.filter(d => selectedForEmail.includes(d.id));
    const docTypes = selectedDocs.map(d => d.documentType).join(', ');
    const fy = engagement?.financialYear || '';
    const cn = client?.companyName || '';
    const fyDate = engagement?.periodEnd ? new Date(engagement.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
    setEmailDocType(docTypes);
    setEmailForm({
      to: client?.contactEmail || '',
      cc: '',
      subject: `Audit Documents — ${cn} FY${fy}`,
      body: `Dear Sir/Madam,\n\nPlease find attached the following audit documents for ${cn} for the financial year ended ${fyDate}:\n\n${selectedDocs.map(d => `• ${d.documentType}`).join('\n')}\n\nKindly acknowledge receipt and confirm the details.\n\nRegards,\nSBC & Co. | KudosFlow`,
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!emailForm.to) { toast.error('Recipient email required'); return; }
    setSendingEmail(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailForm.to,
          cc: emailForm.cc.split(',').map(s => s.trim()).filter(Boolean),
          subject: emailForm.subject,
          body: emailForm.body,
          documentIds: selectedForEmail,
        }),
      });
      if (res.ok) {
        toast.success('Email sent successfully!');
        setShowEmailModal(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err?.error || 'Failed to send email');
      }
    } catch { toast.error('Email error'); }
    finally { setSendingEmail(false); }
  };

  const toggleEmailSelect = (docId: string) => {
    setSelectedForEmail(prev => prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]);
  };

  if (loading) return (<><TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }]} /><div className="p-6"><SkeletonTable rows={6} cols={4} /></div></>);
  if (!engagement) return (<><TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }]} /><div className="p-6"><EmptyState title="Engagement not found" /></div></>);

  const fy = engagement?.financialYear;
  const clientName = client?.companyName || 'Client';
  const generatedCount = docStatuses.length;

  return (
    <>
      <TopNavbar breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' }, { label: 'Clients', href: '/clients' },
        { label: clientName, href: `/clients/${engagement?.clientId}` },
        { label: `FY${fy}` }, { label: 'Documents' },
      ]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Generator — FY{fy} | {clientName}</h1>
            <p className="text-sm text-gray-500 mt-1">{generatedCount}/12 documents generated</p>
          </div>
          <div className="flex gap-2">
            {selectedForEmail.length > 1 && (
              <button onClick={openBulkEmail} className="px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition flex items-center gap-2">
                <Mail size={16} /> Send Selected ({selectedForEmail.length})
              </button>
            )}
            <button onClick={handleGenerateAll} disabled={generatingAll} className="px-5 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-50 flex items-center gap-2">
              {generatingAll ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Generate All 12
            </button>
          </div>
        </div>

        {/* Progress bar for Generate All */}
        {generatingAll && (
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Generating documents...</p>
              <p className="text-sm text-gray-500">{genAllProgress}/12</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
              <div className="bg-accent rounded-full h-3 transition-all duration-500" style={{ width: `${(genAllProgress / 12) * 100}%` }} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" />
              <span>Processing: {genAllCurrent}</span>
            </div>
          </div>
        )}

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCUMENT_TYPES.map((docType, idx) => {
            const status = getDocStatus(docType);
            const isGenerated = !!status;
            const isGenerating = generating[docType];
            const isEmailSelected = status ? selectedForEmail.includes(status.id) : false;
            return (
              <div key={docType} className={`bg-white rounded-xl border p-5 hover:shadow-lg transition-all duration-200 ${isGenerated ? 'border-success/30' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isGenerated && status && (
                      <input type="checkbox" checked={isEmailSelected}
                        onChange={() => toggleEmailSelect(status.id)}
                        className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer" />
                    )}
                    <h3 className="text-sm font-semibold text-gray-900">{idx + 1}. {docType}</h3>
                  </div>
                  {isGenerated ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Generated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>

                {isGenerated && status && (
                  <p className="text-xs text-gray-400 mb-3">
                    Generated: {new Date(status.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {status.emailSent && <span className="ml-2 text-teal-600">• Sent</span>}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-auto">
                  <button onClick={() => handleGenerate(docType)} disabled={isGenerating}
                    className="flex-1 px-3 py-2 text-xs font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                    {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                    {isGenerated ? 'Regenerate' : 'Generate'}
                  </button>
                  <button onClick={() => handleDownload(docType, 'pdf')} disabled={!isGenerated || downloading[`${docType}-pdf`]}
                    className="px-3 py-2 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition disabled:opacity-30 flex items-center gap-1">
                    {downloading[`${docType}-pdf`] ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} PDF
                  </button>
                  <button onClick={() => handleDownload(docType, 'docx')} disabled={!isGenerated || downloading[`${docType}-docx`]}
                    className="px-3 py-2 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition disabled:opacity-30 flex items-center gap-1">
                    {downloading[`${docType}-docx`] ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} DOCX
                  </button>
                  <button onClick={() => openEmailModal(docType)} disabled={!isGenerated}
                    className="px-3 py-2 text-xs font-medium text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition disabled:opacity-30">
                    <Mail size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Send Document via Email</h2>
              <button onClick={() => setShowEmailModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input value={emailForm.to} onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="recipient@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CC (optional, comma-separated)</label>
                <input value={emailForm.cc} onChange={(e) => setEmailForm(prev => ({ ...prev, cc: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="cc1@email.com, cc2@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={emailForm.subject} onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea value={emailForm.body} onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))} rows={6} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="flex flex-wrap gap-2">
                  {selectedForEmail.map(id => {
                    const doc = docStatuses.find(d => d.id === id);
                    if (!doc) return null;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                          <FileText size={12} /> {doc.documentType}.pdf
                        </span>
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                          <FileText size={12} /> {doc.documentType}.docx
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSendEmail} disabled={sendingEmail} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-50 flex items-center justify-center gap-2">
                {sendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
