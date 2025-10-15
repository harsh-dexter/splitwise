import React from 'react';

function UsersIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function GroupCard({ group, onSelectGroup, onInvite }) {
  return (
    <div onClick={() => onSelectGroup(group._id)}
         className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 transform hover:scale-[1.01]">
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{group.name}</h3>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <UsersIcon className="w-4 h-4 mr-2"/>
          <span>{group.members.length} members</span>
        </div>
        <div className="flex justify-end">
          <button onClick={(e) => { e.stopPropagation(); onInvite?.(group._id); }} className="text-sm text-teal-600 hover:text-teal-700">Invite</button>
        </div>
      </div>
    </div>
  );
}
