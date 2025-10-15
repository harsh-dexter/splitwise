import React from 'react';

export default function SettlementList({ settlements }) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">How to Settle Up</h3>
            {settlements && settlements.length > 0 ? (
                <ul className="space-y-3">
                    {settlements.map((s, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center">
                                <span className="font-semibold text-rose-600">{s.from}</span>
                                <span className="mx-2 text-slate-400">→</span>
                                <span className="font-semibold text-emerald-600">{s.to}</span>
                            </div>
                            <span className="font-bold text-slate-800">₹{s.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 text-center py-4">All debts are settled! 🎉</p>
            )}
        </div>
    );
}


