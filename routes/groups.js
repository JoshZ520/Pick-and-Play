const router = require('express').Router();

const groupController = require('../controllers/groups');

//Gets all groups
router.get('/', groupController.allGroups);

//Gets one group from database
router.get('/:id', groupController.singleGroup);

//Creates a new group
router.post('/', groupController.createGroup);

//Updates group
router.put('/:id', groupController.updateGroup);

//Delete group
router.delete('/:id', groupController.deleteGroup);

//Button to create group
router.post('/btnCreateGroup', groupController.btnCreateGroup);

router.post('/deleteGroupBtn', groupController.deleteBtnGroup);

module.exports = router;