const express = require('express');
const { getSettlements } = require('../controllers/settlementController');

const router = express.Router();

router.get('/:groupId', getSettlements);

module.exports = router;


