'use client';
import { useState, useEffect, useCallback } from 'react';
import { TopNavbar } from '@/components/top-navbar';
import { SkeletonTable } from '@/components/skeleton-table';
import { UserCog, Plus, Edit2, ShieldCheck, ShieldOff, Search, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string | null;
  createdAt: string;
}

const ROLES = ['Admin', 'Partner', 'Senior', 'Staff'];
const roleColors: Record<string, { bg: string; text: string }> = {
  Admin: { bg: 'bg-red-100', text: 'text-red-700' },
  Partner: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Senior: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Staff: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<UserData | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Staff' });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res?.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'Staff' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (u: UserData) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.email?.trim()) { toast.error('Name and email are required'); return; }
    if (!editing && !form.password?.trim()) { toast.error('Password is required for new users'); return; }
    setSaving(true);
    try {
      const payload: any = { name: form.name, email: form.email, role: form.role };
      if (form.password?.trim()) payload.password = form.password;
      const url = editing ? `/api/users/${editing.id}` : '/api/users';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res?.ok) { const err = await res?.json(); throw new Error(err?.error ?? 'Failed'); }
      toast.success(editing ? 'User updated' : 'User created');
      resetForm();
      fetchUsers();
    } catch (e: any) { toast.error(e?.message ?? 'Error'); } finally { setSaving(false); }
  };

  const handleToggleStatus = async (u: UserData) => {
    const newStatus = u.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res?.ok) throw new Error('Failed');
      toast.success(`User ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
      fetchUsers();
    } catch { toast.error('Failed to update user status'); }
  };

  const filtered = (users ?? []).filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (search?.trim()) {
      const s = search.toLowerCase();
      return u.name?.toLowerCase()?.includes(s) || u.email?.toLowerCase()?.includes(s);
    }
    return true;
  });

  const formatDate = (d: string | null) => {
    if (!d) return 'Never';
    try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return '-'; }
  };

  return (
    <>
      <TopNavbar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]} />
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
            <p className="text-sm text-gray-500 mt-1">Manage staff accounts and access permissions</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition">
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Edit User' : 'Add New User'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{editing ? 'New Password (leave blank to keep)' : 'Password'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder={editing ? 'Leave blank to keep current' : 'Enter password'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update User' : 'Create User'}
              </button>
              <button onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex gap-2">
            {['All', ...ROLES].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${roleFilter === r ? 'bg-accent text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        {loading ? <SkeletonTable rows={6} cols={6} /> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((u) => {
                    const rc = roleColors[u.role] ?? roleColors.Staff;
                    return (
                      <tr key={u.id} className="border-t border-gray-50 hover:bg-row-hover transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${rc.bg} ${rc.text}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                            {u.status === 'active' ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.lastLogin)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => openEdit(u)} className="p-1.5 rounded-md hover:bg-gray-100 transition" title="Edit">
                              <Edit2 size={15} className="text-gray-400" />
                            </button>
                            <button onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-md transition ${u.status === 'active' ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}
                              title={u.status === 'active' ? 'Disable user' : 'Enable user'}>
                              {u.status === 'active' ? <ShieldOff size={15} className="text-red-400" /> : <ShieldCheck size={15} className="text-green-600" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered?.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
