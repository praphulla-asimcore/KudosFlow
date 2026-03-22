'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopNavbar } from '@/components/top-navbar';
import { StatusBadge } from '@/components/status-badge';
import { SlideOver } from '@/components/slide-over';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { Building2, MapPin, User, Phone, Mail, Pencil, Plus, ArrowRight, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const ENGAGEMENT_TYPES = ['Statutory Audit', 'Tax Compliance', 'Special Audit', 'Review Engagement'];

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [engSlide, setEngSlide] = useState(false);
  const [editEngId, setEditEngId] = useState<string | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [seniors, setSeniors] = useState<any[]>([]);
  const [engForm, setEngForm] = useState<any>({
    financialYear: '2025', periodStart: '', periodEnd: '',
    engagementType: '', partnerId: '', managerId: '',
  });
  const [engSaving, setEngSaving] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (res?.ok) setClient(await res?.json?.());
    } catch {} finally { setLoading(false); }
  }, [clientId]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  useEffect(() => {
    fetch('/api/users/partners-seniors').then((r: any) => r?.json?.()).then((d: any) => {
      setPartners(d?.partners ?? []);
      setSeniors(d?.seniors ?? []);
    }).catch(() => {});
  }, []);

  const openNewEng = () => {
    setEditEngId(null);
    setEngForm({ financialYear: '2025', periodStart: '', periodEnd: '', engagementType: '', partnerId: '', managerId: '' });
    setEngSlide(true);
  };

  const openEditEng = (eng: any) => {
    setEditEngId(eng?.id);
    setEngForm({
      financialYear: String(eng?.financialYear ?? '2025'),
      periodStart: eng?.periodStart ? eng.periodStart.split('T')[0] : '',
      periodEnd: eng?.periodEnd ? eng.periodEnd.split('T')[0] : '',
      engagementType: eng?.engagementType ?? '',
      partnerId: eng?.partnerId ?? eng?.partner?.id ?? '',
      managerId: eng?.managerId ?? eng?.manager?.id ?? '',
      status: eng?.status ?? 'In Progress',
    });
    setEngSlide(true);
  };

  const saveEngagement = async () => {
    setEngSaving(true);
    try {
      const url = editEngId ? `/api/engagements/${editEngId}` : '/api/engagements';
      const method = editEngId ? 'PUT' : 'POST';
      const body = { ...engForm, clientId };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res?.ok) {
        toast.success(editEngId ? 'Engagement updated' : 'Engagement created');
        setEngSlide(false);
        fetchClient();
      } else toast.error('Failed to save');
    } catch { toast.error('Error'); }
    finally { setEngSaving(false); }
  };

  if (loading) return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Clients', href: '/clients' }, { label: 'Loading...' }]} />
      <div className="p-6"><SkeletonTable rows={6} cols={4} /></div>
    </>
  );

  if (!client) return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Clients', href: '/clients' }]} />
      <div className="p-6"><EmptyState title="Client not found" /></div>
    </>
  );

  const engagements = client?.engagements ?? [];

  return (
    <>
      <TopNavbar breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Clients', href: '/clients' },
        { label: client?.companyName ?? 'Client' },
      ]} />

      <div className="p-6 max-w-[1200px] mx-auto w-full">
        {/* Client Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{client?.companyName ?? ''}</h1>
                <StatusBadge status={client?.status ?? 'active'} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Building2 size={14} />{client?.registrationNo ?? '-'}</span>
                <span className="flex items-center gap-1"><FolderOpen size={14} />{client?.industry ?? '-'}</span>
                <span className="flex items-center gap-1">{engagements?.length ?? 0} engagements</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={openNewEng} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                <Plus size={16} /> New Engagement
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {['overview', 'engagements', 'documents'].map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard title="Company Details" icon={<Building2 size={18} />}>
              <DetailRow label="Company Name" value={client?.companyName} />
              <DetailRow label="Registration No" value={client?.registrationNo} />
              <DetailRow label="Industry" value={client?.industry} />
              <DetailRow label="Registered Address" value={client?.registeredAddress} />
              <DetailRow label="Business Address" value={client?.businessAddress} />
            </DetailCard>
            <DetailCard title="Director Details" icon={<User size={18} />}>
              <DetailRow label="Director 1 Name" value={client?.director1Name} />
              <DetailRow label="Director 1 NRIC" value={client?.director1Nric} />
              <DetailRow label="Director 1 Designation" value={client?.director1Designation} />
              {client?.director2Name && (
                <>
                  <DetailRow label="Director 2 Name" value={client?.director2Name} />
                  <DetailRow label="Director 2 NRIC" value={client?.director2Nric} />
                  <DetailRow label="Director 2 Designation" value={client?.director2Designation} />
                </>
              )}
            </DetailCard>
            <DetailCard title="Key Contact" icon={<Phone size={18} />}>
              <DetailRow label="Name" value={client?.contactName} />
              <DetailRow label="Email" value={client?.contactEmail} />
              <DetailRow label="Phone" value={client?.contactPhone} />
            </DetailCard>
          </div>
        )}

        {activeTab === 'engagements' && (
          <div className="space-y-4">
            {(engagements?.length ?? 0) === 0 ? (
              <EmptyState title="No engagements yet" description="Create your first engagement for this client" action="+ New Engagement" onAction={openNewEng} />
            ) : (
              engagements?.map((eng: any) => (
                <div key={eng?.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-navy text-white text-sm font-bold px-3 py-2 rounded-lg">
                        FY{eng?.financialYear ?? ''}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">FY{eng?.financialYear ?? ''} {eng?.engagementType ?? 'Audit'}</h3>
                        <p className="text-sm text-gray-500">
                          {eng?.periodStart ? new Date(eng.periodStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                          {' — '}
                          {eng?.periodEnd ? new Date(eng.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                        </p>
                        <p className="text-sm text-gray-400">Partner: {eng?.partner?.name ?? 'Unassigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={eng?.status ?? 'In Progress'} />
                      <button onClick={() => openEditEng(eng)} className="p-2 text-gray-400 hover:text-accent transition">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => router.push(`/data-entry/${eng?.id}`)} className="bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition">
                        Open <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Document Progress</span>
                      <span>{eng?.docsGeneratedCount ?? 0}/12 docs generated</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2 transition-all"
                        style={{ width: `${((eng?.docsGeneratedCount ?? 0) / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <EmptyState title="No documents yet" description="Generate documents from the engagement Data Entry screen" />
        )}
      </div>

      {/* New/Edit Engagement Slide-over */}
      <SlideOver open={engSlide} onClose={() => setEngSlide(false)} title={editEngId ? 'Edit Engagement' : 'New Engagement'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
            <input type="number" value={engForm?.financialYear ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEngForm((p: any) => ({ ...(p ?? {}), financialYear: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Period Start</label>
            <input type="date" value={engForm?.periodStart ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEngForm((p: any) => ({ ...(p ?? {}), periodStart: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Period End</label>
            <input type="date" value={engForm?.periodEnd ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEngForm((p: any) => ({ ...(p ?? {}), periodEnd: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Type</label>
            <select value={engForm?.engagementType ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEngForm((p: any) => ({ ...(p ?? {}), engagementType: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select type</option>
              {ENGAGEMENT_TYPES?.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Partner</label>
            <select value={engForm?.partnerId ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEngForm((p: any) => ({ ...(p ?? {}), partnerId: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select partner</option>
              {partners?.map((p: any) => <option key={p?.id} value={p?.id}>{p?.name ?? ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager in Charge</label>
            <select value={engForm?.managerId ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEngForm((p: any) => ({ ...(p ?? {}), managerId: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select manager</option>
              {seniors?.map((s: any) => <option key={s?.id} value={s?.id}>{s?.name ?? ''}</option>)}
            </select>
          </div>
          {editEngId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={engForm?.status ?? 'In Progress'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEngForm((p: any) => ({ ...(p ?? {}), status: e?.target?.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t">
            <button onClick={() => setEngSlide(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={saveEngagement} disabled={engSaving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-60">
              {engSaving ? 'Saving...' : 'Save Engagement'}
            </button>
          </div>
        </div>
      </SlideOver>
    </>
  );
}

function DetailCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-accent">{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right max-w-[60%]">{value ?? '-'}</span>
    </div>
  );
}
