import React, { useState } from 'react';
import GroupCard from '../components/dashboard/GroupCard.jsx';
import CreateGroupModal from '../components/dashboard/CreateGroupModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

function PlusIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export default function GroupDashboardPage({ groups, onSelectGroup, onAddGroup, loading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Groups</h2>
        <button onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center bg-sky-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-sky-600 transition-all duration-300 transform hover:scale-105">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Group
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard key={group._id} group={group} onSelectGroup={onSelectGroup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-slate-100 rounded-2xl border border-slate-200/80">
            <h3 className="text-xl font-medium text-slate-700">No groups yet!</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Click "New Group" to get started and track your shared expenses.</p>
          </div>
        )
      )}
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateGroup={onAddGroup} />
    </>
  );
}


