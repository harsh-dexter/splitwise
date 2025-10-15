import React, { useState } from 'react';
import { loginUser } from '../api/api.js';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
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
        navigate('/');
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 w-full max-w-sm border border-slate-200">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-rose-600 text-sm mb-2">{error}</p>}
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input type="email" className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <label className="block text-sm font-medium text-slate-700 mt-3">Password</label>
        <input type="password" className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button disabled={loading} type="submit" className="w-full inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60 mt-4">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="text-sm text-slate-600 mt-3">No account? <Link className="text-teal-600 hover:underline" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
