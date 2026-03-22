'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { Info, Save, ArrowRight, Plus, Trash2, Lock, Unlock, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface DebtorCreditor { name: string; amount: string; type: string; reference: string; }
interface RelatedParty { companyName: string; relationship: string; amount: string; natureOfTransaction: string; }

export default function DataEntryPage() {
  const params = useParams();
  const router = useRouter();
  const engagementId = params?.engagementId as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [engagement, setEngagement] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [dataEntryExists, setDataEntryExists] = useState(false);
  const formRef = useRef<any>(null);

  const [form, setForm] = useState({
    fyEndDate: '', auditPeriod: '', registeredAddress: '', businessAddress: '',
    engagementPartner: '', managerInCharge: '',
    director1Name: '', director1Nric: '', director1Designation: '',
    director2Name: '', director2Nric: '', director2Designation: '',
    bankName: '', accountNumber: '', bankBranch: '', balanceDate: '',
    solicitorFirm: '', solicitorRef: '', hpCompany: '', hpRef: '',
  });
  const [debtorsCreditors, setDebtorsCreditors] = useState<DebtorCreditor[]>([]);
  const [relatedParties, setRelatedParties] = useState<RelatedParty[]>([]);

  // Keep form ref updated
  useEffect(() => { formRef.current = { form, debtorsCreditors, relatedParties, dataEntryExists, isLocked, engagement }; }, [form, debtorsCreditors, relatedParties, dataEntryExists, isLocked, engagement]);

  const fetchData = useCallback(async () => {
    try {
      const engRes = await fetch(`/api/engagements/${engagementId}`);
      if (!engRes.ok) { setLoading(false); return; }
      const engData = await engRes.json();
      setEngagement(engData);

      const clientRes = await fetch(`/api/clients/${engData.clientId}`);
      let clientData: any = null;
      if (clientRes.ok) { clientData = await clientRes.json(); setClient(clientData); }

      const deRes = await fetch(`/api/data-entries?engagementId=${engagementId}`);
      const deData = await deRes.json();

      if (deData && deData.id) {
        setDataEntryExists(true);
        setIsLocked(deData.isLocked ?? false);
        setForm({
          fyEndDate: deData.fyEndDate ? deData.fyEndDate.split('T')[0] : '',
          auditPeriod: deData.auditPeriod || '',
          registeredAddress: deData.registeredAddress || '',
          businessAddress: deData.businessAddress || '',
          engagementPartner: deData.engagementPartner || '',
          managerInCharge: deData.managerInCharge || '',
          director1Name: deData.director1Name || '',
          director1Nric: deData.director1Nric || '',
          director1Designation: deData.director1Designation || '',
          director2Name: deData.director2Name || '',
          director2Nric: deData.director2Nric || '',
          director2Designation: deData.director2Designation || '',
          bankName: deData.bankName || '',
          accountNumber: deData.accountNumber || '',
          bankBranch: deData.bankBranch || '',
          balanceDate: deData.balanceDate ? deData.balanceDate.split('T')[0] : '',
          solicitorFirm: deData.solicitorFirm || '',
          solicitorRef: deData.solicitorRef || '',
          hpCompany: deData.hpCompany || '',
          hpRef: deData.hpRef || '',
        });
        setDebtorsCreditors(deData.debtorsCreditors?.map((dc: any) => ({
          name: dc.name || '', amount: dc.amount ? String(dc.amount) : '', type: dc.type || 'Debtor', reference: dc.reference || '',
        })) || []);
        setRelatedParties(deData.relatedParties?.map((rp: any) => ({
          companyName: rp.companyName || '', relationship: rp.relationship || '',
          amount: rp.amount ? String(rp.amount) : '', natureOfTransaction: rp.natureOfTransaction || '',
        })) || []);
        setLastSaved(new Date(deData.updatedAt));
      } else {
        // Pre-fill from engagement/client
        setForm(prev => ({
          ...prev,
          fyEndDate: engData.periodEnd ? engData.periodEnd.split('T')[0] : '',
          auditPeriod: engData.periodStart && engData.periodEnd
            ? `${new Date(engData.periodStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} to ${new Date(engData.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
            : '',
          registeredAddress: clientData?.registeredAddress || '',
          businessAddress: clientData?.businessAddress || '',
          engagementPartner: engData.partner?.name || '',
          managerInCharge: engData.manager?.name || '',
          director1Name: clientData?.director1Name || '',
          director1Nric: clientData?.director1Nric || '',
          director1Designation: clientData?.director1Designation || 'Director',
          director2Name: clientData?.director2Name || '',
          director2Nric: clientData?.director2Nric || '',
          director2Designation: clientData?.director2Designation || '',
        }));
      }
    } catch (e) { console.error('Fetch error:', e); }
    finally { setLoading(false); }
  }, [engagementId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = formRef.current;
      if (cur && !cur.isLocked && cur.engagement) {
        doSave(false, true);
      }
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  const doSave = async (lock: boolean, isAutoSave: boolean) => {
    const cur = formRef.current;
    if (!cur || !cur.engagement) return;
    if (cur.isLocked && !lock) return;
    if (isAutoSave) setAutoSaveStatus('saving');
    else setSaving(true);
    try {
      const payload = {
        engagementId, clientId: cur.engagement.clientId,
        ...cur.form, isLocked: lock || cur.isLocked,
        debtorsCreditors: cur.debtorsCreditors.filter((dc: any) => dc.name),
        relatedParties: cur.relatedParties.filter((rp: any) => rp.companyName),
      };
      const method = cur.dataEntryExists ? 'PUT' : 'POST';
      const res = await fetch('/api/data-entries', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setDataEntryExists(true);
        setLastSaved(new Date());
        if (isAutoSave) { setAutoSaveStatus('saved'); setTimeout(() => setAutoSaveStatus('idle'), 3000); }
        else toast.success(lock ? 'Data saved and locked' : 'Draft saved');
        if (lock) { setIsLocked(true); router.push(`/documents/${engagementId}`); }
      } else {
        const err = await res.json();
        if (!isAutoSave) toast.error(err?.error || 'Save failed');
      }
    } catch { if (!isAutoSave) toast.error('Save error'); }
    finally { setSaving(false); }
  };

  const handleSave = (lock: boolean) => doSave(lock, false);

  const handleUnlock = async () => {
    const cur = formRef.current;
    if (!cur) return;
    try {
      const res = await fetch('/api/data-entries', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engagementId, ...cur.form, isLocked: false, debtorsCreditors: cur.debtorsCreditors, relatedParties: cur.relatedParties }),
      });
      if (res.ok) { setIsLocked(false); toast.success('Form unlocked for editing'); }
    } catch { toast.error('Failed to unlock'); }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const addDC = () => setDebtorsCreditors(prev => [...prev, { name: '', amount: '', type: 'Debtor', reference: '' }]);
  const removeDC = (idx: number) => setDebtorsCreditors(prev => prev.filter((_, i) => i !== idx));
  const updateDC = (idx: number, key: string, value: string) => setDebtorsCreditors(prev => prev.map((dc, i) => i === idx ? { ...dc, [key]: value } : dc));
  const addRP = () => setRelatedParties(prev => [...prev, { companyName: '', relationship: '', amount: '', natureOfTransaction: '' }]);
  const removeRP = (idx: number) => setRelatedParties(prev => prev.filter((_, i) => i !== idx));
  const updateRP = (idx: number, key: string, value: string) => setRelatedParties(prev => prev.map((rp, i) => i === idx ? { ...rp, [key]: value } : rp));

  if (loading) return (<><TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Entry' }]} /><div className="p-6"><SkeletonTable rows={10} cols={3} /></div></>);
  if (!engagement) return (<><TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Entry' }]} /><div className="p-6"><EmptyState title="Engagement not found" /></div></>);

  const fy = engagement?.financialYear;
  const clientName = client?.companyName || 'Client';

  return (
    <>
      <TopNavbar breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' }, { label: 'Clients', href: '/clients' },
        { label: clientName, href: `/clients/${engagement?.clientId}` },
        { label: `FY${fy}` }, { label: 'Data Entry' },
      ]} />
      <div className="p-6 max-w-[1000px] mx-auto w-full pb-32">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Entry — FY{fy} | {clientName}</h1>
            <p className="text-sm text-gray-500 mt-1">Enter engagement data for document generation</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {autoSaveStatus === 'saving' && <><Loader2 size={14} className="animate-spin" /> Auto-saving...</>}
            {autoSaveStatus === 'saved' && <><Check size={14} className="text-success" /> All changes saved</>}
            {lastSaved && autoSaveStatus === 'idle' && <span>Last saved: {getTimeAgo(lastSaved)}</span>}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info size={20} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-accent">Enter data once — all 12 audit documents will be auto-populated from this single form.</p>
            <p className="text-xs text-blue-500 mt-1">Complete all sections, then click &quot;Save &amp; Continue&quot; to proceed to document generation.</p>
          </div>
        </div>

        {isLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-amber-800">This form is locked.</p>
                <p className="text-xs text-amber-600">Data was saved and locked for document generation.</p>
              </div>
            </div>
            <button onClick={handleUnlock} className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition">
              <Unlock size={14} /> Unlock to Edit
            </button>
          </div>
        )}

        <div className={isLocked ? 'opacity-60 pointer-events-none' : ''}>
          <SectionHeader number={1} title="Client & Engagement Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white rounded-b-xl border border-t-0 p-6">
            <ROField label="Client Name" value={clientName} />
            <ROField label="Company No." value={client?.registrationNo || '-'} />
            <FF label="Financial Year End" type="date" value={form.fyEndDate} onChange={(v) => updateForm('fyEndDate', v)} />
            <FF label="Audit Period" value={form.auditPeriod} onChange={(v) => updateForm('auditPeriod', v)} ph="e.g. 01 Jan 2025 to 31 Dec 2025" />
            <FF label="Registered Address" value={form.registeredAddress} onChange={(v) => updateForm('registeredAddress', v)} ta />
            <FF label="Business Address" value={form.businessAddress} onChange={(v) => updateForm('businessAddress', v)} ta />
            <FF label="Engagement Partner" value={form.engagementPartner} onChange={(v) => updateForm('engagementPartner', v)} />
            <FF label="Manager in Charge" value={form.managerInCharge} onChange={(v) => updateForm('managerInCharge', v)} />
          </div>

          <SectionHeader number={2} title="Director & Signatory Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white rounded-b-xl border border-t-0 p-6">
            <FF label="Director 1 Name" value={form.director1Name} onChange={(v) => updateForm('director1Name', v)} />
            <FF label="Director 1 NRIC" value={form.director1Nric} onChange={(v) => updateForm('director1Nric', v)} />
            <FF label="Director 1 Designation" value={form.director1Designation} onChange={(v) => updateForm('director1Designation', v)} />
            <div className="hidden md:block" />
            <FF label="Director 2 Name" value={form.director2Name} onChange={(v) => updateForm('director2Name', v)} />
            <FF label="Director 2 NRIC" value={form.director2Nric} onChange={(v) => updateForm('director2Nric', v)} />
            <FF label="Director 2 Designation" value={form.director2Designation} onChange={(v) => updateForm('director2Designation', v)} />
          </div>

          <SectionHeader number={3} title="Bank, Solicitor & HP Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white rounded-b-xl border border-t-0 p-6">
            <FF label="Bank Name" value={form.bankName} onChange={(v) => updateForm('bankName', v)} />
            <FF label="Account Number" value={form.accountNumber} onChange={(v) => updateForm('accountNumber', v)} />
            <FF label="Branch" value={form.bankBranch} onChange={(v) => updateForm('bankBranch', v)} />
            <FF label="Balance Date" type="date" value={form.balanceDate} onChange={(v) => updateForm('balanceDate', v)} />
            <FF label="Solicitor Firm Name" value={form.solicitorFirm} onChange={(v) => updateForm('solicitorFirm', v)} />
            <FF label="Solicitor Reference" value={form.solicitorRef} onChange={(v) => updateForm('solicitorRef', v)} />
            <FF label="Hire Purchase Company" value={form.hpCompany} onChange={(v) => updateForm('hpCompany', v)} />
            <FF label="HP Reference Number" value={form.hpRef} onChange={(v) => updateForm('hpRef', v)} />
          </div>

          <SectionHeader number={4} title="Debtors & Creditors" />
          <div className="mb-8 bg-white rounded-b-xl border border-t-0 p-6">
            {debtorsCreditors.length > 0 && (
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Name</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Amount (MYR)</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Type</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Reference</th>
                    <th className="w-10"></th>
                  </tr></thead>
                  <tbody>{debtorsCreditors.map((dc, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={dc.name} onChange={(e) => updateDC(i, 'name', e.target.value)} placeholder="Name" /></td>
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={dc.amount} onChange={(e) => updateDC(i, 'amount', e.target.value)} placeholder="0.00" type="number" step="0.01" /></td>
                      <td className="py-2 px-2"><select className="w-full px-2 py-1.5 border rounded text-sm bg-white" value={dc.type} onChange={(e) => updateDC(i, 'type', e.target.value)}><option value="Debtor">Debtor</option><option value="Creditor">Creditor</option></select></td>
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={dc.reference} onChange={(e) => updateDC(i, 'reference', e.target.value)} placeholder="Reference" /></td>
                      <td className="py-2 px-2"><button onClick={() => removeDC(i)} className="p-1 text-gray-400 hover:text-danger transition"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            <button onClick={addDC} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition"><Plus size={16} /> Add Debtor/Creditor</button>
          </div>

          <SectionHeader number={5} title="Related Party Details" />
          <div className="mb-8 bg-white rounded-b-xl border border-t-0 p-6">
            {relatedParties.length > 0 && (
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Company Name</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Relationship</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Amount (MYR)</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-600">Nature of Transaction</th>
                    <th className="w-10"></th>
                  </tr></thead>
                  <tbody>{relatedParties.map((rp, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={rp.companyName} onChange={(e) => updateRP(i, 'companyName', e.target.value)} placeholder="Company Name" /></td>
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={rp.relationship} onChange={(e) => updateRP(i, 'relationship', e.target.value)} placeholder="Relationship" /></td>
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={rp.amount} onChange={(e) => updateRP(i, 'amount', e.target.value)} placeholder="0.00" type="number" step="0.01" /></td>
                      <td className="py-2 px-2"><input className="w-full px-2 py-1.5 border rounded text-sm" value={rp.natureOfTransaction} onChange={(e) => updateRP(i, 'natureOfTransaction', e.target.value)} placeholder="Nature" /></td>
                      <td className="py-2 px-2"><button onClick={() => removeRP(i)} className="p-1 text-gray-400 hover:text-danger transition"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            <button onClick={addRP} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition"><Plus size={16} /> Add Related Party</button>
          </div>
        </div>

        {!isLocked && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-40">
            <div className="max-w-[1000px] mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {autoSaveStatus === 'saving' && <span className="flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> Auto-saving...</span>}
                {autoSaveStatus === 'saved' && <span className="flex items-center gap-1.5 text-success"><Check size={14} /> All changes saved</span>}
                {autoSaveStatus === 'idle' && lastSaved && <span>Last saved: {getTimeAgo(lastSaved)}</span>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleSave(false)} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"><Save size={16} /> Save Draft</button>
                <button onClick={() => handleSave(true)} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-50 flex items-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />} Save &amp; Continue
                </button>
              </div>
            </div>
          </div>
        )}
        {isLocked && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-40">
            <div className="max-w-[1000px] mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-500">Form is locked. Unlock to make edits, or go to Document Generator.</p>
              <button onClick={() => router.push(`/documents/${engagementId}`)} className="px-5 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition flex items-center gap-2">Go to Documents <ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (<div className="bg-navy text-white px-5 py-3 rounded-t-xl flex items-center gap-3"><span className="bg-accent text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{number}</span><h2 className="text-sm font-bold uppercase tracking-wide">{title}</h2></div>);
}
function FF({ label, value, onChange, type = 'text', ph, ta }: { label: string; value: string; onChange: (v: string) => void; type?: string; ph?: string; ta?: boolean }) {
  return (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{ta ? (<textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" rows={3} placeholder={ph} />) : (<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder={ph} />)}</div>);
}
function ROField({ label, value }: { label: string; value: string }) {
  return (<div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-700">{value}</div></div>);
}
function getTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
