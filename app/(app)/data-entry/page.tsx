'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { EmptyState } from '@/components/empty-state';
import { Database, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';

export default function DataEntryIndexPage() {
  const router = useRouter();
  const [engagements, setEngagements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(async (res: any) => {
        const clientList = res?.clients ?? (Array.isArray(res) ? res : []);
        const allEngs: any[] = [];
        for (const client of clientList) {
          try {
            const res = await fetch(`/api/clients/${client.id}`);
            if (res.ok) {
              const data = await res.json();
              (data.engagements || []).forEach((eng: any) => {
                allEngs.push({ ...eng, clientName: data.companyName, clientId: data.id });
              });
            }
          } catch {}
        }
        allEngs.sort((a, b) => b.financialYear - a.financialYear);
        setEngagements(allEngs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Entry' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Entry</h1>
        <p className="text-sm text-gray-500 mb-6">Select an engagement to enter or update data for document generation.</p>

        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : engagements.length === 0 ? (
          <EmptyState title="No engagements found" description="Create an engagement from a client profile first." action="Go to Clients" onAction={() => router.push('/clients')} />
        ) : (
          <div className="space-y-3">
            {engagements.map((eng: any) => (
              <div key={eng.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-navy text-white text-sm font-bold px-3 py-2 rounded-lg">FY{eng.financialYear}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{eng.clientName}</h3>
                    <p className="text-sm text-gray-500">{eng.engagementType || 'Audit'} • Partner: {eng.partner?.name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={eng.status || 'In Progress'} />
                  <button onClick={() => router.push(`/data-entry/${eng.id}`)} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition">
                    <Database size={14} /> Open <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}