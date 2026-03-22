'use client';
import { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { History, Download, Mail, ChevronDown, ChevronUp, FileText, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({ clientId: '', documentType: '', userId: '' });
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const DOCUMENT_TYPES = [
    'Engagement Letter', 'Letter of Representation', 'Bank Confirmation',
    'Debtor Confirmation', 'Creditor Confirmation', 'Related Party Confirmation',
    'Director Confirmation', 'Solicitor Confirmation', 'Hire Purchase Confirmation',
    'Inter-company Confirmation', 'Corporate Guarantee Confirmation', 'Management Representation Letter',
  ];

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.clientId) params.set('clientId', filters.clientId);
      if (filters.documentType) params.set('documentType', filters.documentType);
      if (filters.userId) params.set('userId', filters.userId);
      const res = await fetch(`/api/documents/history?${params.toString()}`);
      if (res.ok) setDocs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(d => setClients(d?.clients ?? (Array.isArray(d) ? d : []))).catch(() => {});
    fetch('/api/users/partners-seniors').then(r => r.json()).then(d => {
      const all = [...(d?.partners || []), ...(d?.seniors || []), ...(d?.admins || [])];
      setUsers(all);
    }).catch(() => {});
  }, []);

  const handleDownload = async (doc: any, format: 'pdf' | 'docx') => {
    const key = `${doc.id}-${format}`;
    setDownloading(prev => ({ ...prev, [key]: true }));
    try {
      const url = `/api/documents/download?engagementId=${doc.engagement?.id || doc.engagementId}&documentType=${encodeURIComponent(doc.documentType)}&format=${format}`;
      const res = await fetch(url);
      if (!res.ok) { toast.error('Download failed'); return; }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${doc.documentType.replace(/[^a-zA-Z0-9]/g, '_')}_FY${doc.engagement?.financialYear || ''}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch { toast.error('Download error'); }
    finally { setDownloading(prev => ({ ...prev, [key]: false })); }
  };

  const clearFilters = () => setFilters({ clientId: '', documentType: '', userId: '' });
  const hasFilters = filters.clientId || filters.documentType || filters.userId;

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Document History' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generated Documents History</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all generated documents</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-accent hover:underline flex items-center gap-1 ml-2">
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={filters.clientId} onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">All Clients</option>
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
            </select>
            <select value={filters.documentType} onChange={(e) => setFilters(prev => ({ ...prev, documentType: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">All Document Types</option>
              {DOCUMENT_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
            </select>
            <select value={filters.userId} onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">All Users</option>
              {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : docs.length === 0 ? (
          <EmptyState title="No documents generated yet" description="Generate documents from the Document Generator screen" />
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Document Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">FY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Generated By</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc: any) => (
                    <>
                      <tr key={doc.id} className="border-b hover:bg-row-hover transition cursor-pointer" onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-accent" />
                            <span className="font-medium text-gray-900">{doc.documentType}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{doc.client?.companyName || '-'}</td>
                        <td className="py-3 px-4"><span className="bg-navy text-white text-xs font-bold px-2 py-1 rounded">FY{doc.engagement?.financialYear || '-'}</span></td>
                        <td className="py-3 px-4 text-gray-600">{doc.generatedBy?.name || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{doc.generatedAt ? new Date(doc.generatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                        <td className="py-3 px-4">
                          {doc.emailSent ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                              <Mail size={10} /> Sent
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not Sent</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleDownload(doc, 'pdf')} disabled={downloading[`${doc.id}-pdf`]} className="px-2 py-1 text-xs font-medium text-gray-600 border rounded hover:bg-gray-50 transition disabled:opacity-30 flex items-center gap-1">
                              <Download size={12} /> PDF
                            </button>
                            <button onClick={() => handleDownload(doc, 'docx')} disabled={downloading[`${doc.id}-docx`]} className="px-2 py-1 text-xs font-medium text-gray-600 border rounded hover:bg-gray-50 transition disabled:opacity-30 flex items-center gap-1">
                              <Download size={12} /> DOCX
                            </button>
                            {expandedId === doc.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                          </div>
                        </td>
                      </tr>
                      {expandedId === doc.id && (
                        <tr key={`${doc.id}-expanded`} className="bg-gray-50">
                          <td colSpan={7} className="px-8 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><span className="text-gray-500">Email Recipient:</span><br /><span className="font-medium">{doc.emailRecipient || 'N/A'}</span></div>
                              <div><span className="text-gray-500">Email Subject:</span><br /><span className="font-medium">{doc.emailSubject || 'N/A'}</span></div>
                              <div><span className="text-gray-500">Sent At:</span><br /><span className="font-medium">{doc.emailSentAt ? new Date(doc.emailSentAt).toLocaleString('en-GB') : 'N/A'}</span></div>
                              <div><span className="text-gray-500">Document ID:</span><br /><span className="font-medium text-xs text-gray-400">{doc.id}</span></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}