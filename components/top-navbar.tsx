'use client';
import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function TopNavbar({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
  const { data: session } = useSession() || {};
  const user = session?.user as any;
  const initials = (user?.name ?? 'U')?.split(' ')?.map((n: string) => n?.[0] ?? '')?.join('')?.toUpperCase() ?? 'U';
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef?.current && !menuRef.current.contains(e?.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm pl-10 lg:pl-0">
        {breadcrumbs?.map((crumb: BreadcrumbItem, i: number) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
            {crumb?.href ? (
              <a href={crumb.href} className="text-accent hover:underline">{crumb?.label ?? ''}</a>
            ) : (
              <span className="text-gray-600 font-medium">{crumb?.label ?? ''}</span>
            )}
          </span>
        )) ?? null}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition"
          >
            <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name ?? 'User'}</p>
              <p className="text-xs text-gray-400">{user?.role ?? 'Staff'}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
