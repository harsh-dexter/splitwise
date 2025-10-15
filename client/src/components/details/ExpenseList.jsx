import React from 'react';

function ReceiptIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}

export default function ExpenseList({ expenses }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Expenses</h3>
      <ul className="space-y-4">
        {expenses && [...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).map(exp => (
          <li key={exp._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center">
              <div className="bg-sky-100 text-sky-600 rounded-full p-2 mr-4">
                <ReceiptIcon className="w-5 h-5"/>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{exp.title}</p>
                <p className="text-sm text-slate-500">
                  Paid by {exp.paidBy} on {new Date(exp.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-slate-800">₹{exp.amount.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Split with {exp.participants.length}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


