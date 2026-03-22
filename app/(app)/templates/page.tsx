'use client';
import { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FileCode, Plus, ChevronDown, ChevronRight, Edit2, Trash2, Copy, Tag, Check, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  documentType: string;
  description: string | null;
  content: string;
  placeholders: string | null;
  version: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const DOCUMENT_TYPES = [
  'Engagement Letter', 'Letter of Representation', 'Bank Confirmation',
  'Debtor Confirmation', 'Creditor Confirmation', 'Related Party Confirmation',
  'Director Confirmation', 'Solicitor Confirmation', 'Hire Purchase Confirmation',
  'Inter-company Confirmation', 'Corporate Guarantee Confirmation', 'Management Representation Letter',
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: '', documentType: '', description: '', content: '', placeholders: '' });
  const [saving, setSaving] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res?.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const resetForm = () => {
    setForm({ name: '', documentType: '', description: '', content: '', placeholders: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (t: Template) => {
    setEditing(t);
    let placeholderStr = '';
    try { placeholderStr = JSON.parse(t?.placeholders ?? '[]')?.join(', ') ?? ''; } catch { placeholderStr = t?.placeholders ?? ''; }
    setForm({ name: t.name, documentType: t.documentType, description: t.description ?? '', content: t.content, placeholders: placeholderStr });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.documentType || !form.content?.trim()) {
      toast.error('Name, type, and content are required');
      return;
    }
    setSaving(true);
    try {
      const placeholders = form.placeholders?.split(',')?.map((p: string) => p?.trim())?.filter(Boolean) ?? [];
      const payload = { ...form, placeholders };
      const url = editing ? `/api/templates/${editing.id}` : '/api/templates';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res?.ok) { const err = await res?.json(); throw new Error(err?.error ?? 'Failed'); }
      toast.success(editing ? 'Template updated' : 'Template created');
      resetForm();
      fetchTemplates();
    } catch (e: any) { toast.error(e?.message ?? 'Error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/templates/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res?.ok) { const err = await res?.json(); throw new Error(err?.error ?? 'Failed'); }
      toast.success('Template deleted');
      setDeleteTarget(null);
      fetchTemplates();
    } catch (e: any) { toast.error(e?.message ?? 'Error'); }
  };

  const handleToggleActive = async (t: Template) => {
    try {
      await fetch(`/api/templates/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !t.isActive }),
      });
      toast.success(t.isActive ? 'Template deactivated' : 'Template activated');
      fetchTemplates();
    } catch { toast.error('Failed to update'); }
  };

  const parsePlaceholders = (raw: string | null): string[] => {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  };

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Templates' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Template Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Manage document templates with placeholders and version control</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition"
          >
            <Plus size={16} /> New Template
          </button>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Edit Template' : 'Create Template'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. Custom Bank Confirmation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                  disabled={!!editing}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:bg-gray-100">
                  <option value="">Select type...</option>
                  {DOCUMENT_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Brief description..." />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholders (comma-separated)</label>
              <input type="text" value={form.placeholders} onChange={(e) => setForm({ ...form, placeholders: e.target.value })}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-mono"
                placeholder="clientName, bankName, accountNumber, ..." />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 font-mono"
                placeholder="Use {{placeholderName}} for dynamic values..." />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}
              </button>
              <button onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Template List */}
        {loading ? <SkeletonTable rows={6} cols={5} /> : (
          <div className="space-y-3">
            {templates?.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="bg-accent/10 p-4 rounded-full inline-block mb-4"><FileCode size={32} className="text-accent" /></div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">No Templates Yet</h2>
                <p className="text-sm text-gray-500">Create your first document template to get started.</p>
              </div>
            )}
            {templates?.map((t) => {
              const isExpanded = expandedId === t.id;
              const phs = parsePlaceholders(t.placeholders);
              return (
                <div key={t.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  >
                    {isExpanded ? <ChevronDown size={18} className="text-gray-400 shrink-0" /> : <ChevronRight size={18} className="text-gray-400 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                        {t.isDefault && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">DEFAULT</span>}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {t.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{t.documentType} &middot; v{t.version}{t.description ? ` — ${t.description}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleToggleActive(t)} className="p-1.5 rounded-md hover:bg-gray-100 transition" title={t.isActive ? 'Deactivate' : 'Activate'}>
                        {t.isActive ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-green-600" />}
                      </button>
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-gray-100 transition" title="Edit">
                        <Edit2 size={15} className="text-gray-400" />
                      </button>
                      {!t.isDefault && (
                        <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-md hover:bg-red-50 transition" title="Delete">
                          <Trash2 size={15} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t bg-gray-50 px-5 py-4">
                      {phs.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Placeholders</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phs.map((p: string) => (
                              <span key={p} className="inline-flex items-center gap-1 bg-white border px-2 py-1 rounded text-xs font-mono text-accent">
                                <Tag size={10} /> {`{{${p}}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Content Preview</p>
                      <pre className="bg-white border rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto font-mono">{t.content}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
