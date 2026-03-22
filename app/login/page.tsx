'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { KudosLogo } from '@/components/kudos-logo';
import toast from 'react-hot-toast';
import { ToastProvider } from '@/components/toast-provider';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email?.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
    if (!password?.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs)?.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email?.trim(),
        password,
        redirect: false,
      });
      if (result?.ok) {
        // Log audit event
        try {
          await fetch('/api/audit-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'LOGIN', module: 'Auth', details: `User logged in: ${email}` }),
          });
        } catch {}
        router.replace('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
      <ToastProvider />
      {/* Background circle */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border-[3px] border-accent/20" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border-[2px] border-accent/10" />

      <div className="w-full max-w-[420px] mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-navy">
              <KudosLogo size="lg" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center">Sign in to KudosFlow</h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">Audit Document Platform by Kudos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value ?? '')}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${
                  errors?.email ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="you@company.com"
              />
              {errors?.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e?.target?.value ?? '')}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition pr-10 ${
                    errors?.password ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors?.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center mt-4">
            <a href="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</a>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">&copy; 2026 Kudos | KudosFlow v1.0</p>
      </div>
    </div>
  );
}
