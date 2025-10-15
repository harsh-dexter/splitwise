const express = require('express');
const { createExpense, getExpensesByGroup } = require('../controllers/expenseController');

const router = express.Router();

router.post('/', createExpense);
router.get('/:groupId', getExpensesByGroup);

module.exports = router;


