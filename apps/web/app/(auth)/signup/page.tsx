'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'PLATFORM_ADMIN'>('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(name, email, password, role);
      login(res.access_token, res.user);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-xl font-black tracking-[0.3em] uppercase text-black">CHIAC-ASI</Link>
          <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 mt-2">Onboarding Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black tracking-tight mb-2">Create your account</h1>
            <p className="text-sm text-slate-500 font-medium">Start your personalized learning journey</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                placeholder="Glen Elric"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Account Type</label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'PLATFORM_ADMIN')}
                className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
              >
                <option value="USER">Learner</option>
                <option value="PLATFORM_ADMIN">Admin / Course Creator</option>
              </select>
            </div>
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
