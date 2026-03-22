'use client';
import { FolderOpen } from 'lucide-react';

export function EmptyState({ title, description, action, onAction }: {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <FolderOpen size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title ?? ''}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      {action && onAction && (
        <button onClick={onAction} className="mt-4 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition">
          {action}
        </button>
      )}
    </div>
  );
}
