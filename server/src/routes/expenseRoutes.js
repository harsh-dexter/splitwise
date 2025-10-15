const express = require('express');
const { createExpense, getExpensesByGroup } = require('../controllers/expenseController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);
router.post('/', createExpense);
router.get('/:groupId', getExpensesByGroup);

module.exports = router;


