'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      login(res.access_token, res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-black text-indigo-900 mb-2">Aura Learning</h1>
          <p className="text-on-surface-variant">Sign in to your account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
              placeholder="sarah@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-secondary font-bold hover:underline">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}
