import React, { useEffect, useState } from 'react';
import AddExpenseForm from '../components/details/AddExpenseForm.jsx';
import BalanceSummary from '../components/details/BalanceSummary.jsx';
import SettlementList from '../components/details/SettlementList.jsx';
import ExpenseList from '../components/details/ExpenseList.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { getSettlements, getSummary } from '../api/api.js';
import EditGroupModal from '../components/dashboard/EditGroupModal.jsx';

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export default function GroupDetailPage({ group, onBack, onAddExpense, onEditGroup }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const summaryData = await getSummary(group._id);
        if (summaryData.success) {
          setSummary(summaryData.balances.summary);
        }

        const settlementsData = await getSettlements(group._id);
        if (settlementsData.success) {
          setSettlements(settlementsData.settlements);
        }
      } catch (error) {
        console.error('Failed to fetch group details:', error);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [group._id, group.expenses]);

  return (
    <>
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors mr-3">
          <ArrowLeftIcon className="w-6 h-6 text-slate-600"/>
        </button>
        <h2 className="text-3xl font-bold text-slate-800 truncate">{group.name}</h2>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setEditModalOpen(true)}
                  className="flex items-center bg-white text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50">
            Edit
          </button>
          <button onClick={() => setAddModalOpen(true)}
                  className="flex items-center bg-sky-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-sky-600 transition-all duration-300 transform hover:scale-105">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner/> : (
        <div className="space-y-8">
          <BalanceSummary balances={summary} />
          <SettlementList settlements={settlements} />
          <ExpenseList expenses={group.expenses} />
        </div>
      )}

      <AddExpenseForm
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddExpense={onAddExpense}
        members={group.members}
      />

      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        group={group}
        onSave={(payload) => {
          onEditGroup(group._id, payload);
          setEditModalOpen(false);
        }}
      />
    </>
  );
}


