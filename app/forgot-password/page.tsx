'use client';
import { useState } from 'react';
import { ArrowLeft, Mail, Loader2, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { KudosLogo } from '@/components/kudos-logo';
import toast from 'react-hot-toast';
import { ToastProvider } from '@/components/toast-provider';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!email?.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email format'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res?.json();
      if (data?.resetLink) {
        setResetLink(data.resetLink);
      }
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (resetLink) {
      const fullLink = `${window.location.origin}${resetLink}`;
      navigator.clipboard.writeText(fullLink);
      toast.success('Reset link copied to clipboard');
    }
  };

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

          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-gray-900 text-center">Forgot Password</h1>
              <p className="text-sm text-gray-500 text-center mt-1 mb-6">Enter your email address and we&apos;ll generate a password reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${error ? 'border-danger' : 'border-gray-300'}`}
                    placeholder="you@company.com" />
                  {error && <p className="text-xs text-danger mt-1">{error}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><Mail size={16} /> Send Reset Link</>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-sm text-gray-500 mt-2 mb-4">If an account exists with <span className="font-medium text-gray-700">{email}</span>, a password reset link has been generated.</p>

              {resetLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-xs font-semibold text-blue-700 mb-2">Reset Link (Internal Tool)</p>
                  <div className="flex items-center gap-2">
                    <Link href={resetLink} className="text-xs text-accent hover:underline break-all flex-1 font-mono">
                      {resetLink}
                    </Link>
                    <button onClick={copyLink} className="shrink-0 p-1.5 rounded hover:bg-blue-100 transition" title="Copy link">
                      <Copy size={14} className="text-blue-600" />
                    </button>
                  </div>
                  <Link href={resetLink} className="mt-3 inline-flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-accent-hover transition">
                    <ExternalLink size={12} /> Go to Reset Page
                  </Link>
                </div>
              )}

              <button onClick={() => { setSent(false); setResetLink(''); }}
                className="text-sm text-accent hover:underline">Try another email</button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent transition">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-6">&copy; 2026 Kudos | KudosFlow v1.0</p>
      </div>
    </div>
  );
}
