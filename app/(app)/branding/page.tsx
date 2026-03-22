'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { Palette, Upload, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface BrandingData {
  id: string;
  firmName: string;
  firmTagline: string | null;
  firmAddress: string | null;
  firmPhone: string | null;
  firmEmail: string | null;
  firmWebsite: string | null;
  logoBase64: string | null;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  showLogoOnDocs: boolean;
  showAddressOnDocs: boolean;
  footerText: string | null;
}

const FONTS = ['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Courier New'];

export default function BrandingPage() {
  const [data, setData] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBranding = useCallback(async () => {
    try {
      const res = await fetch('/api/branding');
      const json = await res?.json();
      setData(json);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBranding(); }, [fetchBranding]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/branding', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res?.ok) throw new Error('Failed to save');
      const updated = await res.json();
      setData(updated);
      toast.success('Branding settings saved');
    } catch (e: any) { toast.error(e?.message ?? 'Error'); } finally { setSaving(false); }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file || !data) return;
    if (file.size > 500000) { toast.error('Logo must be under 500KB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData({ ...data, logoBase64: ev?.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const update = (field: string, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  if (loading) {
    return (
      <>
        <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branding' }]} />
        <div className="p-6"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48" /><div className="h-64 bg-gray-200 rounded" /></div></div>
      </>
    );
  }

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branding' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Branding & Letterhead</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your firm&apos;s visual identity for generated documents</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Firm Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Firm Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                  <input type="text" value={data?.firmName ?? ''} onChange={(e) => update('firmName', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input type="text" value={data?.firmTagline ?? ''} onChange={(e) => update('firmTagline', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. Chartered Accountants" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={data?.firmAddress ?? ''} onChange={(e) => update('firmAddress', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={data?.firmPhone ?? ''} onChange={(e) => update('firmPhone', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={data?.firmEmail ?? ''} onChange={(e) => update('firmEmail', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="text" value={data?.firmWebsite ?? ''} onChange={(e) => update('firmWebsite', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Firm Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {data?.logoBase64 ? (
                    <img src={data.logoBase64} alt="Firm logo" className="w-full h-full object-contain" />
                  ) : (
                    <Palette size={24} className="text-gray-300" />
                  )}
                </div>
                <div>
                  <input type="file" ref={fileRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button onClick={() => fileRef?.current?.click()}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                    <Upload size={14} /> Upload Logo
                  </button>
                  <p className="text-xs text-gray-400 mt-1.5">PNG or JPG, max 500KB</p>
                  {data?.logoBase64 && (
                    <button onClick={() => update('logoBase64', null)} className="text-xs text-red-500 hover:underline mt-1">Remove logo</button>
                  )}
                </div>
              </div>
            </div>

            {/* Colors & Font */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Colors & Typography</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={data?.primaryColor ?? '#0D1F29'} onChange={(e) => update('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer" />
                    <input type="text" value={data?.primaryColor ?? ''} onChange={(e) => update('primaryColor', e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={data?.accentColor ?? '#2A73E4'} onChange={(e) => update('accentColor', e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer" />
                    <input type="text" value={data?.accentColor ?? ''} onChange={(e) => update('accentColor', e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                  <select value={data?.fontFamily ?? 'Inter'} onChange={(e) => update('fontFamily', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Document Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Document Options</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={data?.showLogoOnDocs ?? true} onChange={(e) => update('showLogoOnDocs', e.target.checked)}
                    className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent" />
                  <span className="text-sm text-gray-700">Show logo on generated documents</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={data?.showAddressOnDocs ?? true} onChange={(e) => update('showAddressOnDocs', e.target.checked)}
                    className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent" />
                  <span className="text-sm text-gray-700">Show firm address on letterhead</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                <input type="text" value={data?.footerText ?? ''} onChange={(e) => update('footerText', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="e.g. AF License No. 12345" />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Letterhead Preview</h2>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="aspect-[210/297] p-6 flex flex-col" style={{ fontFamily: data?.fontFamily ?? 'Inter' }}>
                  {/* Header */}
                  <div className="border-b-2 pb-4 mb-6" style={{ borderColor: data?.accentColor ?? '#2A73E4' }}>
                    <div className="flex items-start gap-3">
                      {data?.showLogoOnDocs && data?.logoBase64 && (
                        <img src={data.logoBase64} alt="Logo" className="w-12 h-12 object-contain" />
                      )}
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: data?.primaryColor ?? '#0D1F29' }}>{data?.firmName ?? 'Firm Name'}</h3>
                        {data?.firmTagline && <p className="text-[10px] tracking-wider uppercase" style={{ color: data?.accentColor ?? '#2A73E4' }}>{data.firmTagline}</p>}
                      </div>
                    </div>
                    {data?.showAddressOnDocs && data?.firmAddress && (
                      <p className="text-[9px] text-gray-400 mt-2">{data.firmAddress}</p>
                    )}
                    <div className="flex gap-4 mt-1">
                      {data?.firmPhone && <p className="text-[9px] text-gray-400">{data.firmPhone}</p>}
                      {data?.firmEmail && <p className="text-[9px] text-gray-400">{data.firmEmail}</p>}
                    </div>
                  </div>
                  {/* Body Placeholder */}
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-1/3" />
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-5/6" />
                    <div className="h-2 bg-gray-100 rounded w-4/6" />
                    <div className="h-2 bg-gray-100 rounded w-full mt-4" />
                    <div className="h-2 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-5/6" />
                  </div>
                  {/* Footer */}
                  {data?.footerText && (
                    <div className="border-t pt-2 mt-4">
                      <p className="text-[8px] text-gray-400 text-center">{data.footerText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
