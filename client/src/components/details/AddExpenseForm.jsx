import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';

export default function AddExpenseForm({ isOpen, onClose, onAddExpense, members }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState(members[0] || '');
    const [participants, setParticipants] = useState(members);

    useEffect(() => {
        if (members) {
            setPaidBy(members[0] || '');
            setParticipants(members);
        }
    }, [members]);

    const handleParticipantChange = (member) => {
        setParticipants(prev =>
            prev.includes(member) ? prev.filter(p => p !== member) : [...prev, member]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && amount > 0 && paidBy && participants.length > 0) {
            onAddExpense({
                title, amount: parseFloat(amount), paidBy, participants
            });
            setTitle(''); setAmount('');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"/>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
                        <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition"/>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700">Paid by</label>
                        <select value={paidBy} onChange={e => setPaidBy(e.target.value)} required
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/60 transition">
                            {members.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Split between</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
                        {members.map(member => (
                            <label key={member} className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all ${participants.includes(member) ? 'bg-teal-100 border-teal-300' : 'bg-slate-50 border-slate-200'}`}>
                                <input type="checkbox" checked={participants.includes(member)}
                                    onChange={() => handleParticipantChange(member)}
                                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-medium text-slate-800">{member}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 active:bg-teal-700/90 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/60">
                        Add Expense
                    </button>
                </div>
            </form>
        </Modal>
    );
}
