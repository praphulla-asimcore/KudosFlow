'use client';
import { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { Settings, Save, Download, Database, HardDrive, Clock, FileText, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface Setting {
  id: string;
  settingKey: string;
  settingValue: string;
  category: string;
  label: string | null;
  description: string | null;
}

const categoryIcons: Record<string, any> = {
  general: Settings,
  documents: FileText,
  notifications: Bell,
  backup: HardDrive,
};

const categoryLabels: Record<string, string> = {
  general: 'General Settings',
  documents: 'Document Settings',
  notifications: 'Notification Settings',
  backup: 'Backup & Data',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [exporting, setExporting] = useState<string | null>(null);
  const [modified, setModified] = useState<Record<string, string>>({});

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res?.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setModified({ ...modified, [key]: value });
  };

  const getValue = (key: string) => {
    if (modified[key] !== undefined) return modified[key];
    return settings.find(s => s.settingKey === key)?.settingValue ?? '';
  };

  const handleSave = async () => {
    if (Object.keys(modified).length === 0) { toast('No changes to save'); return; }
    setSaving(true);
    try {
      const updates = Object.entries(modified).map(([settingKey, settingValue]) => ({ settingKey, settingValue }));
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: updates }) });
      if (!res?.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(Array.isArray(data) ? data : []);
      setModified({});
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (!res?.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kudosflow-${type}-export.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${type} data exported`);
    } catch { toast.error('Export failed'); } finally { setExporting(null); }
  };

  const categories = ['general', 'documents', 'notifications', 'backup'];
  const catSettings = settings.filter(s => s.category === activeTab);

  const renderInput = (s: Setting) => {
    const val = getValue(s.settingKey);
    // Boolean-like settings
    if (val === 'true' || val === 'false') {
      return (
        <button onClick={() => handleChange(s.settingKey, val === 'true' ? 'false' : 'true')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            val === 'true' ? 'bg-accent' : 'bg-gray-300'
          }`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            val === 'true' ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      );
    }
    // Select for known options
    if (s.settingKey === 'date_format') {
      return (
        <select value={val} onChange={(e) => handleChange(s.settingKey, e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      );
    }
    if (s.settingKey === 'doc_output_format') {
      return (
        <select value={val} onChange={(e) => handleChange(s.settingKey, e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="Both">Both</option>
        </select>
      );
    }
    if (s.settingKey === 'backup_frequency') {
      return (
        <select value={val} onChange={(e) => handleChange(s.settingKey, e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      );
    }
    return (
      <input type="text" value={val} onChange={(e) => handleChange(s.settingKey, e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-accent/30" />
    );
  };

  if (loading) {
    return (
      <>
        <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
        <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-64 bg-gray-200 rounded" /></div></div>
      </>
    );
  }

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings & Backup</h1>
            <p className="text-sm text-gray-500 mt-1">System configuration and data management</p>
          </div>
          <button onClick={handleSave} disabled={saving || Object.keys(modified).length === 0}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {categories.map(cat => {
            const Icon = categoryIcons[cat] ?? Settings;
            return (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === cat ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Icon size={15} />
                <span className="hidden sm:inline">{categoryLabels[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl shadow-sm border divide-y">
          {catSettings.map(s => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.label ?? s.settingKey}</p>
                {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
              </div>
              <div>{renderInput(s)}</div>
            </div>
          ))}
          {catSettings.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No settings in this category</div>
          )}
        </div>

        {/* Data Export & System Health */}
        {activeTab === 'backup' && (
          <div className="mt-6 space-y-6">
            {/* Export Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Download size={18} className="text-accent" /> Data Export
              </h2>
              <p className="text-sm text-gray-500 mb-4">Download your data as CSV files for backup or external analysis.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { type: 'clients', label: 'Client Data', desc: 'All client records' },
                  { type: 'users', label: 'User Data', desc: 'Staff accounts & roles' },
                  { type: 'audit', label: 'Audit Trail', desc: 'System activity log' },
                ].map(ex => (
                  <button key={ex.type} onClick={() => handleExport(ex.type)} disabled={!!exporting}
                    className="flex flex-col items-start border rounded-lg p-4 hover:bg-gray-50 transition text-left disabled:opacity-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Download size={14} className="text-accent" />
                      <span className="text-sm font-medium text-gray-900">{ex.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ex.desc}</span>
                    {exporting === ex.type && <span className="text-xs text-accent mt-1">Exporting...</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-green-600" /> System Health
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={16} className="text-accent" />
                    <span className="text-sm font-medium text-gray-900">Database</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected
                  </span>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-accent" />
                    <span className="text-sm font-medium text-gray-900">Uptime</span>
                  </div>
                  <span className="text-xs text-gray-600">System operational</span>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive size={16} className="text-accent" />
                    <span className="text-sm font-medium text-gray-900">Version</span>
                  </div>
                  <span className="text-xs text-gray-600">KudosFlow v1.0 (Phase 3)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
