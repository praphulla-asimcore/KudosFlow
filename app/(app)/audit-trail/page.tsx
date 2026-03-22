'use client';
import { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { ShieldCheck, Search, Download, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const actionColors: Record<string, { bg: string; text: string }> = {
  GENERATE: { bg: 'bg-green-100', text: 'text-green-700' },
  LOGIN: { bg: 'bg-blue-100', text: 'text-blue-700' },
  UPDATE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CREATE: { bg: 'bg-purple-100', text: 'text-purple-700' },
  LOGOUT: { bg: 'bg-gray-100', text: 'text-gray-600' },
  DELETE: { bg: 'bg-red-100', text: 'text-red-700' },
};

const ACTIONS = ['All', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'GENERATE', 'DELETE'];
const MODULES = ['All', 'Auth', 'Dashboard', 'Clients', 'Engagements', 'Documents', 'Templates', 'Branding', 'Users', 'Settings', 'Export'];

export default function AuditTrailPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      if (actionFilter !== 'All') params.set('action', actionFilter);
      if (moduleFilter !== 'All') params.set('module', moduleFilter);
      if (search?.trim()) params.set('search', search);
      const res = await fetch(`/api/audit-log?${params.toString()}`);
      const data = await res?.json();
      setEvents(data?.data ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setTotal(data?.total ?? 0);
    } catch { setEvents([]); } finally { setLoading(false); }
  }, [page, actionFilter, moduleFilter, search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export?type=audit');
      if (!res?.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kudosflow-audit-export.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Audit trail exported');
    } catch { toast.error('Export failed'); } finally { setExporting(false); }
  };

  const formatTs = (d: string) => {
    try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch { return '-'; }
  };

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Audit Trail' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-accent" />
            <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          </div>
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50">
            <Download size={14} /> {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-6 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">Audit trail records are immutable. All entries are timestamped and cannot be edited or deleted. {total > 0 && <span className="font-semibold">{total} total records.</span>}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search events..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
            {ACTIONS.map(a => <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>)}
          </select>
          <select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
            {MODULES.map(m => <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? <SkeletonTable rows={10} cols={6} /> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {events?.map((e: any) => {
                    const colors = actionColors?.[e?.action] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
                    return (
                      <tr key={e?.id} className="border-t border-gray-50 hover:bg-row-hover transition">
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTs(e?.createdAt)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{e?.userName ?? '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colors.bg} ${colors.text}`}>{e?.action ?? '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{e?.module ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{e?.details ?? '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{e?.ipAddress ?? '-'}</td>
                      </tr>
                    );
                  })}
                  {events?.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No audit trail entries found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                <p className="text-xs text-gray-500">Page {page} of {totalPages} ({total} records)</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                    className="p-1.5 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-30 transition">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                    className="p-1.5 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-30 transition">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
