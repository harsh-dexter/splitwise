import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';

export default function EditGroupModal({ isOpen, onClose, group, onSave }) {
  const [name, setName] = useState(group?.name || '');
  const [membersInput, setMembersInput] = useState((group?.members || []).join(', '));

  useEffect(() => {
    setName(group?.name || '');
    setMembersInput((group?.members || []).join(', '));
  }, [group]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = membersInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);
    onSave({ name, members });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Group">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Members (comma-separated)</label>
          <input
            type="text"
            value={membersInput}
            onChange={(e) => setMembersInput(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"
          />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">Cancel</button>
          <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">Save</button>
        </div>
      </form>
    </Modal>
  );
}
