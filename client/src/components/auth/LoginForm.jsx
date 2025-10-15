import React, { useState } from 'react';
import { loginUser } from '../../api/api.js';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('auth.token', res.token);
        if (res.user) {
          localStorage.setItem('auth.user', JSON.stringify(res.user));
        }
        try { window.dispatchEvent(new Event('auth:changed')); } catch (_) {}
        onSuccess?.();
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-rose-600 text-sm">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-6">
        <button disabled={loading} type="submit" className="w-full inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </form>
  );
}
