const express = require('express');
const { getGroups, createGroup, getGroupById, updateGroup, generateInvite, getGroupByInvite, joinGroupByInvite } = require('../controllers/groupController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Public lookup before auth middleware
router.get('/invite/:code', getGroupByInvite);

// Protected routes
router.use(authRequired);
router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);
router.post('/:id/invite', generateInvite);
router.post('/join/:code', joinGroupByInvite);

module.exports = router;


