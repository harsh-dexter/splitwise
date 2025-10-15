const express = require('express');
const { getGroups, createGroup, getGroupById, updateGroup } = require('../controllers/groupController');

const router = express.Router();

router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);

module.exports = router;


