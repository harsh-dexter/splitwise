const express = require('express');
const { getSummary } = require('../controllers/summaryController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);
router.get('/:groupId', getSummary);

module.exports = router;


