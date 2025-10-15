import React, { useEffect, useState } from 'react';
import GroupDashboardPage from './pages/GroupDashboardPage.jsx';
import GroupDetailPage from './pages/GroupDetailPage.jsx';
import { createExpense, createGroup, getGroup, getGroups, updateGroup, getMe } from './api/api.js';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import JoinPage from './pages/JoinPage.jsx';

function ProtectedApp({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth.token') : null;
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('auth.user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  });

  const fetchGroupsList = async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      if (data.success) {
        setGroups(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroupsList();
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await getMe();
        if (res.success) setCurrentUser(res.user);
      } catch {}
    };
    if (!currentUser && typeof window !== 'undefined' && localStorage.getItem('auth.token')) {
      loadMe();
    }
  }, [currentUser]);

  useEffect(() => {
    const onAuthChanged = () => {
      const u = localStorage.getItem('auth.user');
      setCurrentUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  const handleAddGroup = async ({ name, members }) => {
    try {
      const data = await createGroup({ name, members });
      if (data.success) {
        fetchGroupsList();
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const data = await createExpense({ ...expenseData, groupId: selectedGroupId });
      if (data.success) {
        const groupData = await getGroup(selectedGroupId);
        if (groupData.success) {
          setGroups(prev => prev.map(g => g._id === selectedGroupId ? groupData.data : g));
        }
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const selectedGroup = groups.find(g => g._id === selectedGroupId);

  const handleEditGroup = async (groupId, payload) => {
    try {
      const updated = await updateGroup(groupId, payload);
      if (updated.success) {
        setGroups(prev => prev.map(g => g._id === groupId ? updated.data : g));
      }
    } catch (e) {
      console.error('Failed to update group:', e);
    }
  };

  const appShell = (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <style>
        {`@keyframes modal-enter { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-modal-enter { animation: modal-enter 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }`}
      </style>
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <svg className="w-8 h-8 text-teal-600 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1Z"/></svg>
          <h1 className="text-xl font-bold text-slate-800">Splitter</h1>
          <div className="ml-auto flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center font-semibold">
                    {(currentUser.name || currentUser.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-sm">
                    <div className="font-medium text-slate-800 leading-tight">{currentUser.name}</div>
                    <div className="text-slate-500 leading-tight">{currentUser.email}</div>
                  </div>
                </div>
                <button onClick={() => { localStorage.removeItem('auth.token'); localStorage.removeItem('auth.user'); window.location.href = '/'; }} className="text-sm text-slate-600 hover:text-rose-600 px-2 py-1">Logout</button>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            )}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {selectedGroup ? (
            <GroupDetailPage
              group={selectedGroup}
              onBack={() => setSelectedGroupId(null)}
              onAddExpense={handleAddExpense}
              onEditGroup={handleEditGroup}
            />
          ) : (
            <GroupDashboardPage
              groups={groups}
              onSelectGroup={setSelectedGroupId}
              onAddGroup={handleAddGroup}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join/:code" element={<JoinPage />} />
        <Route path="/app" element={<ProtectedApp>{appShell}</ProtectedApp>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
