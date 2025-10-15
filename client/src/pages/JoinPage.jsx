import React, { useEffect, useState } from 'react';
import { lookupInvite, joinByInvite } from '../api/api.js';
import { useNavigate, useParams } from 'react-router-dom';

export default function JoinPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await lookupInvite(code);
        if (res.success) setGroup(res.group);
        else setError(res.error || 'Invalid invite');
      } catch (e) {
        setError('Invalid invite');
      }
    })();
  }, [code]);

  const handleJoin = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth.token') : null;
    if (!token) {
      const redirectUrl = `/join/${code}`;
      window.location.href = `/?afterLoginRedirect=${encodeURIComponent(redirectUrl)}`;
      return;
    }
    try {
      const res = await joinByInvite(code);
      if (res.success) {
        navigate('/app');
      } else {
        setError(res.error || 'Failed to join');
      }
    } catch (e) {
      setError('Failed to join');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md border border-slate-200 text-center">
        {group ? (
          <>
            <h1 className="text-xl font-bold mb-2">Join {group.name}</h1>
            <p className="text-slate-600 mb-6">Click join to become a member of this group.</p>
            <button onClick={handleJoin} className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">Join group</button>
          </>
        ) : (
          <p className="text-rose-600">{error || 'Loading...'}</p>
        )}
      </div>
    </div>
  );
}
