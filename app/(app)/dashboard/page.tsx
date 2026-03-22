'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TopNavbar } from '@/components/top-navbar';
import { StatCard } from '@/components/stat-card';
import { SkeletonTable } from '@/components/skeleton-table';
import { Briefcase, FolderOpen, FileText, Clock, Plus, FilePlus, History } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TopClientsChart = dynamic(() => import('./top-clients-chart'), { ssr: false, loading: () => <div className="skeleton h-64 rounded-xl" /> });

const actionColors: Record<string, { bg: string; text: string }> = {
  GENERATE: { bg: 'bg-green-100', text: 'text-green-700' },
  LOGIN: { bg: 'bg-blue-100', text: 'text-blue-700' },
  UPDATE: { bg: 'bg-orange-100', text: 'text-orange-700' },
  CREATE: { bg: 'bg-purple-100', text: 'text-purple-700' },
  LOGOUT: { bg: 'bg-gray-100', text: 'text-gray-600' },
  EMAIL: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date)?.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then((r: any) => r?.json?.()),
      fetch('/api/dashboard/activity').then((r: any) => r?.json?.()),
    ]).then(([s, a]: any[]) => {
      setStats(s ?? {});
      setActivities(a ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const userName = (session?.user as any)?.name?.split(' ')?.[0] ?? 'there';

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {userName}</h1>
        <p className="text-sm text-gray-500 mb-6">Here&apos;s your audit automation overview</p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Clients" value={stats?.totalClients ?? 0} icon={<Briefcase size={22} />} color="bg-accent" subtitle="Active clients" />
          <StatCard title="Active Engagements" value={stats?.activeEngagements ?? 0} icon={<FolderOpen size={22} />} color="bg-success" subtitle="FY2025 cycle" />
          <StatCard title="Docs Generated Today" value={stats?.docsToday ?? 0} icon={<FileText size={22} />} color="bg-success" subtitle="Today" />
          <StatCard title="Pending Documents" value={stats?.pendingDocs ?? 0} icon={<Clock size={22} />} color="bg-warning" subtitle="Requires action" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {loading ? <SkeletonTable rows={6} cols={3} /> : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {(activities ?? [])?.map((a: any) => {
                  const colors = actionColors?.[a?.action] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
                  return (
                    <div key={a?.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colors.bg} ${colors.text} shrink-0`}>
                        {a?.action ?? 'UNKNOWN'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{a?.details ?? ''}</p>
                        <p className="text-xs text-gray-400">{a?.userName ?? 'System'}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(a?.createdAt ?? new Date().toISOString())}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/clients?action=new" className="flex flex-col items-center gap-2 p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition text-accent">
                  <Plus size={24} />
                  <span className="text-sm font-medium">New Client</span>
                </Link>
                <Link href="/clients" className="flex flex-col items-center gap-2 p-4 bg-navy/5 rounded-xl hover:bg-navy/10 transition text-navy">
                  <FilePlus size={24} />
                  <span className="text-sm font-medium">New Engagement</span>
                </Link>
                <Link href="/documents" className="flex flex-col items-center gap-2 p-4 bg-success/10 rounded-xl hover:bg-success/20 transition text-success">
                  <FileText size={24} />
                  <span className="text-sm font-medium">Generate Docs</span>
                </Link>
                <Link href="/history" className="flex flex-col items-center gap-2 p-4 bg-warning/10 rounded-xl hover:bg-warning/20 transition text-warning">
                  <History size={24} />
                  <span className="text-sm font-medium">View History</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Clients by Documents</h2>
          <TopClientsChart />
        </div>
      </div>
    </>
  );
}
