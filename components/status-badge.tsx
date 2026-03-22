'use client';

const statusColors: Record<string, { dot: string; bg: string; text: string }> = {
  active: { dot: 'bg-success', bg: 'bg-green-50', text: 'text-green-700' },
  archived: { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600' },
  disabled: { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600' },
  'In Progress': { dot: 'bg-warning', bg: 'bg-orange-50', text: 'text-orange-700' },
  'Completed': { dot: 'bg-success', bg: 'bg-green-50', text: 'text-green-700' },
  'On Hold': { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600' },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors?.[status ?? ''] ?? { dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status ?? 'Unknown'}
    </span>
  );
}
