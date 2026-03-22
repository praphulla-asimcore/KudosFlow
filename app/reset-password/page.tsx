'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { KudosLogo } from '@/components/kudos-logo';
import toast from 'react-hot-toast';
import { ToastProvider } from '@/components/toast-provider';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!password?.trim()) { setError('New password is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res?.json();
      if (!res?.ok) {
        setError(data?.error ?? 'Failed to reset password');
        return;
      }
      setDone(true);
      toast.success('Password reset successfully!');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Invalid Reset Link</h1>
        <p className="text-sm text-gray-500 mt-2 mb-4">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-sm text-accent hover:underline">Request a new reset link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Password Reset!</h1>
        <p className="text-sm text-gray-500 mt-2 mb-4">Your password has been successfully reset. You can now sign in with your new password.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 text-center">Reset Password</h1>
      <p className="text-sm text-gray-500 text-center mt-1 mb-6">Enter your new password below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition pr-10"
              placeholder="Enter new password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <input type="password" value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            placeholder="Confirm new password" />
        </div>
        {error && <p className="text-xs text-danger text-center">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset Password'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-gray-500 hover:text-accent transition">Back to Sign In</Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      <ToastProvider />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border-[3px] border-accent/20" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border-[2px] border-accent/10" />
      <div className="w-full max-w-[420px] mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="text-navy"><KudosLogo size="lg" /></div>
          </div>
          <Suspense fallback={<div className="text-center"><Loader2 size={24} className="animate-spin text-accent mx-auto" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
        <p className="text-center text-xs text-white/40 mt-6">&copy; 2026 Kudos | KudosFlow v1.0</p>
      </div>
    </div>
  );
}
