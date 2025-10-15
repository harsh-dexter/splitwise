const express = require('express');
const { getSettlements } = require('../controllers/settlementController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);
router.get('/:groupId', getSettlements);

module.exports = router;


