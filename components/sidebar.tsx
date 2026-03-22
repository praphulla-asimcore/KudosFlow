'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard, Users, Briefcase, FileText, FolderOpen,
  History, FileCode, Palette, UserCog, ShieldCheck, Settings,
  ChevronLeft, ChevronRight, Menu, X, Database
} from 'lucide-react';
import { KudosLogo } from './kudos-logo';

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Briefcase },
  { label: 'Engagements', href: '/engagements', icon: FolderOpen },
  { label: 'Data Entry', href: '/data-entry', icon: Database },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'History', href: '/history', icon: History },
  { label: 'Templates', href: '/templates', icon: FileCode, adminOnly: true },
  { label: 'Branding', href: '/branding', icon: Palette, adminOnly: true },
  { label: 'Users', href: '/users', icon: UserCog, adminOnly: true },
  { label: 'Audit Trail', href: '/audit-trail', icon: ShieldCheck, roles: ['Admin', 'Partner'] },
  { label: 'Settings', href: '/settings', icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const role = (session?.user as any)?.role ?? 'Staff';

  const filteredItems = menuItems?.filter((item: MenuItem) => {
    if (item?.adminOnly && role !== 'Admin') return false;
    if (item?.roles && !item.roles.includes(role)) return false;
    return true;
  }) ?? [];

  const isActive = (href: string) => pathname?.startsWith(href);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div className="text-white">
            <KudosLogo size="md" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-white/60 hover:text-white transition-colors p-1"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems?.map((item: MenuItem) => {
          const Icon = item?.icon;
          const active = isActive(item?.href ?? '');
          return (
            <Link
              key={item?.href}
              href={item?.href ?? '#'}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-accent text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {Icon && <Icon size={20} className="shrink-0" />}
              {!collapsed && <span>{item?.label ?? ''}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">KudosFlow v1.0</p>
          <p className="text-xs text-white/30">© 2026 Kudos</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-navy text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 h-full bg-navy"
            onClick={(e: React.MouseEvent) => e?.stopPropagation?.()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-navy h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
}
