function computeBalances(expenses, members) {
    const balances = {};
    members.forEach(member => {
        balances[member] = { paid: 0, owed: 0, net: 0 };
    });

    expenses.forEach(expense => {
        if (!expense.participants || expense.participants.length === 0) return;
        const share = expense.amount / expense.participants.length;

        if (balances[expense.paidBy]) {
            balances[expense.paidBy].paid += expense.amount;
        }

        expense.participants.forEach(p => {
            if (balances[p]) {
                balances[p].owed += share;
            }
        });
    });

    const netBalances = {};
    for (const member in balances) {
        balances[member].net = balances[member].paid - balances[member].owed;
        netBalances[member] = balances[member].net;
    }

    return {
        summary: balances,
        net: netBalances,
    };
}

function settleBalances(balance) {
    const debtors = [], creditors = [], settlements = [];

    for (const [person, amount] of Object.entries(balance)) {
        if (amount < 0) debtors.push({ p: person, amt: -amount });
        if (amount > 0) creditors.push({ p: person, amt: amount });
    }

    debtors.sort((a, b) => b.amt - a.amt);
    creditors.sort((a, b) => b.amt - a.amt);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const pay = Math.min(debtors[i].amt, creditors[j].amt);

        if (pay > 0.01) {
            settlements.push({ from: debtors[i].p, to: creditors[j].p, amount: pay });
        }

        debtors[i].amt -= pay;
        creditors[j].amt -= pay;

        if (debtors[i].amt < 0.01) i++;
        if (creditors[j].amt < 0.01) j++;
    }
    return settlements;
}

module.exports = { computeBalances, settleBalances };


