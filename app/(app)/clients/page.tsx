'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopNavbar } from '@/components/top-navbar';
import { StatusBadge } from '@/components/status-badge';
import { SlideOver } from '@/components/slide-over';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { Plus, Search, Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const INDUSTRIES = ['Technology', 'Trading', 'Manufacturing', 'Construction', 'Finance', 'Real Estate', 'Healthcare', 'Other'];

interface ClientFormData {
  companyName: string;
  registrationNo: string;
  registeredAddress: string;
  businessAddress: string;
  sameAsRegistered: boolean;
  industry: string;
  director1Name: string;
  director1Nric: string;
  director1Designation: string;
  director2Name: string;
  director2Nric: string;
  director2Designation: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const emptyForm: ClientFormData = {
  companyName: '', registrationNo: '', registeredAddress: '', businessAddress: '',
  sameAsRegistered: false, industry: '', director1Name: '', director1Nric: '',
  director1Designation: 'Director', director2Name: '', director2Nric: '',
  director2Designation: '', contactName: '', contactEmail: '', contactPhone: '',
};

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormData>({ ...emptyForm });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [archiveDialog, setArchiveDialog] = useState<{ open: boolean; clientId: string; name: string }>({ open: false, clientId: '', name: '' });

  const fetchClients = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search?.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/clients?${params.toString()}`);
      const data = await res?.json?.();
      setClients(data?.clients ?? []);
      setCounts(data?.counts ?? {});
    } catch { } finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  useEffect(() => {
    if (searchParams?.get('action') === 'new') {
      setEditingId(null);
      setForm({ ...emptyForm });
      setSlideOpen(true);
    }
  }, [searchParams]);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm }); setFormErrors({}); setSlideOpen(true); };
  const openEdit = (client: any) => {
    setEditingId(client?.id ?? null);
    setForm({
      companyName: client?.companyName ?? '',
      registrationNo: client?.registrationNo ?? '',
      registeredAddress: client?.registeredAddress ?? '',
      businessAddress: client?.businessAddress ?? '',
      sameAsRegistered: client?.registeredAddress === client?.businessAddress,
      industry: client?.industry ?? '',
      director1Name: client?.director1Name ?? '',
      director1Nric: client?.director1Nric ?? '',
      director1Designation: client?.director1Designation ?? 'Director',
      director2Name: client?.director2Name ?? '',
      director2Nric: client?.director2Nric ?? '',
      director2Designation: client?.director2Designation ?? '',
      contactName: client?.contactName ?? '',
      contactEmail: client?.contactEmail ?? '',
      contactPhone: client?.contactPhone ?? '',
    });
    setFormErrors({});
    setSlideOpen(true);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form?.companyName?.trim()) errs.companyName = 'Company name is required';
    if (!form?.registrationNo?.trim()) errs.registrationNo = 'Registration number is required';
    if (!form?.director1Name?.trim()) errs.director1Name = 'Director 1 name is required';
    if (!form?.director1Nric?.trim()) errs.director1Nric = 'Director 1 NRIC is required';
    setFormErrors(errs);
    return Object.keys(errs)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/clients/${editingId}` : '/api/clients';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res?.ok) {
        toast.success(editingId ? 'Client updated' : 'Client created');
        setSlideOpen(false);
        fetchClients();
      } else {
        toast.error('Failed to save client');
      }
    } catch { toast.error('Error saving client'); }
    finally { setSaving(false); }
  };

  const handleArchive = async () => {
    try {
      await fetch(`/api/clients/${archiveDialog?.clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      toast.success('Client archived');
      fetchClients();
    } catch { toast.error('Failed to archive'); }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev: ClientFormData) => ({ ...(prev ?? {}), [field]: value }));
  };

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Clients' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-sm text-gray-500">Manage audit clients</p>
          </div>
          <button onClick={openNew} className="bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus size={18} /> Add Client
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'archived'] as const).map((tab: string) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === tab ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)} ({counts?.[tab] ?? 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e?.target?.value ?? '')}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        {/* Table */}
        {loading ? <SkeletonTable rows={6} cols={6} /> : (clients?.length ?? 0) === 0 ? (
          <EmptyState title="No clients found" description="Add your first audit client to get started" action="+ Add Client" onAction={openNew} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reg. No.</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Industry</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Engagements</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.map((c: any) => (
                    <tr key={c?.id} className="border-t border-gray-50 hover:bg-row-hover transition">
                      <td className="px-4 py-3">
                        <Link href={`/clients/${c?.id}`} className="text-sm font-semibold text-accent hover:underline">
                          {c?.companyName ?? 'Unknown'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c?.registrationNo ?? '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c?.industry ?? '-'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                          {c?.engagementCount ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c?.status ?? 'active'} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/clients/${c?.id}`} className="p-1.5 text-gray-400 hover:text-accent transition" title="View">
                            <Eye size={16} />
                          </Link>
                          <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-accent transition" title="Edit">
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Slide-over */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editingId ? 'Edit Client' : 'Add New Client'}>
        <div className="space-y-4">
          <FormField label="Company Name *" value={form?.companyName ?? ''} onChange={(v: string) => updateField('companyName', v)} error={formErrors?.companyName} />
          <FormField label="Registration No. *" value={form?.registrationNo ?? ''} onChange={(v: string) => updateField('registrationNo', v)} error={formErrors?.registrationNo} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address</label>
            <textarea value={form?.registeredAddress ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('registeredAddress', e?.target?.value ?? '')} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form?.sameAsRegistered ?? false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('sameAsRegistered', e?.target?.checked)} className="rounded border-gray-300 text-accent focus:ring-accent" />
            Business address same as registered
          </label>
          {!form?.sameAsRegistered && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <textarea value={form?.businessAddress ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('businessAddress', e?.target?.value ?? '')} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select value={form?.industry ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('industry', e?.target?.value ?? '')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
              <option value="">Select industry</option>
              {INDUSTRIES?.map((ind: string) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Director 1 Details</h3>
            <div className="space-y-3">
              <FormField label="Director 1 Name *" value={form?.director1Name ?? ''} onChange={(v: string) => updateField('director1Name', v)} error={formErrors?.director1Name} />
              <FormField label="Director 1 NRIC *" value={form?.director1Nric ?? ''} onChange={(v: string) => updateField('director1Nric', v)} error={formErrors?.director1Nric} />
              <FormField label="Director 1 Designation" value={form?.director1Designation ?? ''} onChange={(v: string) => updateField('director1Designation', v)} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Director 2 Details (Optional)</h3>
            <div className="space-y-3">
              <FormField label="Director 2 Name" value={form?.director2Name ?? ''} onChange={(v: string) => updateField('director2Name', v)} />
              <FormField label="Director 2 NRIC" value={form?.director2Nric ?? ''} onChange={(v: string) => updateField('director2Nric', v)} />
              <FormField label="Director 2 Designation" value={form?.director2Designation ?? ''} onChange={(v: string) => updateField('director2Designation', v)} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Key Contact</h3>
            <div className="space-y-3">
              <FormField label="Contact Name" value={form?.contactName ?? ''} onChange={(v: string) => updateField('contactName', v)} />
              <FormField label="Contact Email" value={form?.contactEmail ?? ''} onChange={(v: string) => updateField('contactEmail', v)} />
              <FormField label="Contact Phone" value={form?.contactPhone ?? ''} onChange={(v: string) => updateField('contactPhone', v)} />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={() => setSlideOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={archiveDialog?.open}
        onClose={() => setArchiveDialog({ open: false, clientId: '', name: '' })}
        onConfirm={handleArchive}
        title="Archive Client"
        message={`Are you sure you want to archive ${archiveDialog?.name ?? 'this client'}? The client will be hidden from active workflows but retained for historical access.`}
        confirmLabel="Archive"
        variant="warning"
      />
    </>
  );
}

function FormField({ label, value, onChange, error, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e?.target?.value ?? '')}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 ${error ? 'border-danger' : 'border-gray-300'}`}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
