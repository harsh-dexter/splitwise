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
            className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Members (comma-separated)</label>
          <input
            type="text"
            value={membersInput}
            onChange={(e) => setMembersInput(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
          <button type="submit" className="py-2 px-5 rounded-lg text-white bg-sky-500 hover:bg-sky-600">Save</button>
        </div>
      </form>
    </Modal>
  );
}



