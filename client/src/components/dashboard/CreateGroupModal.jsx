import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup }) {
    const [name, setName] = useState('');
    const [members, setMembers] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && members) {
            const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
            if (memberList.length > 0) {
                onCreateGroup({ name, members: memberList });
                setName('');
                setMembers('');
                onClose();
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Group">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="group-name" className="block text-sm font-medium text-slate-700">Group Name</label>
                    <input type="text" id="group-name" value={name} onChange={(e) => setName(e.target.value)} required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"/>
                </div>
                <div>
                    <label htmlFor="group-members" className="block text-sm font-medium text-slate-700">Members (comma-separated)</label>
                    <input type="text" id="group-members" value={members} onChange={(e) => setMembers(e.target.value)} required
                        placeholder="e.g., Alice, Bob, Carol"
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"/>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
}
