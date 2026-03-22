'use client';
import { TopNavbar } from '@/components/top-navbar';
import { EmptyState } from '@/components/empty-state';
import { useRouter } from 'next/navigation';

export default function EngagementsPage() {
  const router = useRouter();
  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Engagements' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Engagements</h1>
        <p className="text-sm text-gray-500 mb-6">Access engagements through individual client profiles</p>
        <EmptyState
          title="Select a client first"
          description="Engagements are accessed from the client profile page. Navigate to Clients and select a client to view their engagements."
          action="Go to Clients"
          onAction={() => router.push('/clients')}
        />
      </div>
    </>
  );
}
