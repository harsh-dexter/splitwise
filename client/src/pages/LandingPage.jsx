import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LandingPage() {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const afterLoginRedirect = searchParams.get('afterLoginRedirect') || '/app';

  const onAuthSuccess = () => navigate(afterLoginRedirect);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-teal-600 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1Z"/></svg>
          <span className="text-xl font-bold text-slate-900">Splitter</span>
        </div>
        <button onClick={()=>setTab(tab==='login'?'register':'login')} className="text-teal-700 hover:underline">
          {tab === 'login' ? 'Create account' : 'Login'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <section className="order-2 md:order-1">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Split expenses, <span className="text-teal-700">beautifully</span>.
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-xl">
            Create groups, add expenses, see who owes what, and settle up effortlessly.
          </p>
          <ul className="mt-8 space-y-3 text-slate-700">
            <li className="flex items-start"><span className="mt-1 mr-3 text-teal-600">✓</span> Simple group creation and quick expense entry</li>
            <li className="flex items-start"><span className="mt-1 mr-3 text-teal-600">✓</span> Clear balances and smart settlement suggestions</li>
            <li className="flex items-start"><span className="mt-1 mr-3 text-teal-600">✓</span> Fast, modern UI powered by React + Vite + Tailwind</li>
          </ul>
          {afterLoginRedirect && afterLoginRedirect !== '/app' && (
            <button onClick={()=>navigate(`/`)} className="mt-8 text-sm text-teal-700 hover:underline">
              Returning? Continue to sign in to join your invite
            </button>
          )}
        </section>
        <section className="order-1 md:order-2">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] border border-slate-200 p-8">
            <div className="flex mb-6 border-b border-slate-200">
              <button onClick={()=>setTab('login')} className={`px-4 py-2 mr-2 font-semibold transition ${tab==='login'?'text-teal-700 border-b-2 border-teal-600':'text-slate-500 hover:text-slate-700'}`}>Login</button>
              <button onClick={()=>setTab('register')} className={`px-4 py-2 font-semibold transition ${tab==='register'?'text-teal-700 border-b-2 border-teal-600':'text-slate-500 hover:text-slate-700'}`}>Register</button>
            </div>
            {tab === 'login' ? (
              <LoginForm onSuccess={onAuthSuccess} />
            ) : (
              <RegisterForm onSuccess={onAuthSuccess} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
