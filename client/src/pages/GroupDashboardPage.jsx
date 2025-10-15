import React, { useState } from 'react';
import GroupCard from '../components/dashboard/GroupCard.jsx';
import { generateInviteLink } from '../api/api.js';
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

  const handleInvite = async (groupId) => {
    try {
      const res = await generateInviteLink(groupId);
      if (res.success) {
        const link = res.inviteLink;
        let copied = false;
        try {
          if (navigator.clipboard && document.hasFocus && document.hasFocus()) {
            await navigator.clipboard.writeText(link);
            copied = true;
          }
        } catch (_) {
          copied = false;
        }

        if (!copied) {
          // Fallback copy using a temporary textarea
          const el = document.createElement('textarea');
          el.value = link;
          el.setAttribute('readonly', '');
          el.style.position = 'absolute';
          el.style.left = '-9999px';
          document.body.appendChild(el);
          el.select();
          try { document.execCommand('copy'); copied = true; } catch (_) {}
          document.body.removeChild(el);
        }

        if (copied) {
          alert('Invite link copied to clipboard');
        } else {
          alert(`Invite link: ${link}`);
        }
      }
    } catch (e) {
      console.error('Failed to generate invite:', e);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Groups</h2>
        <button onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Group
        </button>
      </div>
      {loading ? <LoadingSpinner /> : (
        groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard key={group._id} group={group} onSelectGroup={onSelectGroup} onInvite={handleInvite} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)]">
            <h3 className="text-xl font-medium text-slate-700">No groups yet!</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Click "New Group" to get started and track your shared expenses.</p>
          </div>
        )
      )}
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateGroup={onAddGroup} />
    </>
  );
}
