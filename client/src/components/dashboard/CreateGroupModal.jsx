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
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <div>
                    <label htmlFor="group-members" className="block text-sm font-medium text-slate-700">Members (comma-separated)</label>
                    <input type="text" id="group-members" value={members} onChange={(e) => setMembers(e.target.value)} required
                        placeholder="e.g., Alice, Bob, Carol"
                        className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit"
                        className="inline-flex justify-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all transform hover:scale-105">
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
}


