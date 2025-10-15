import React from 'react';

export default function BalanceSummary({ balances }) {
    if (!balances) return null;
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Balances</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 rounded-l-lg">Member</th>
                            <th scope="col" className="px-6 py-3">Paid</th>
                            <th scope="col" className="px-6 py-3">Share</th>
                            <th scope="col" className="px-6 py-3 rounded-r-lg text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(balances).map(([member, data]) => (
                            <tr key={member} className="bg-white border-b border-slate-200/80 last:border-b-0">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{member}</th>
                                <td className="px-6 py-4 text-slate-600">₹{data.paid.toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-600">₹{data.owed.toFixed(2)}</td>
                                <td className="px-6 py-4 font-bold text-right">
                                    <span className={data.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                        {data.net >= 0 ? '+' : ''}₹{data.net.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


