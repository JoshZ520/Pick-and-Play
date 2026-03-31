const router = require('express').Router();

const groupController = require('../controllers/groups');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

//Gets all groups
/*
#swagger.tags = ['Groups']
#swagger.description = 'Get all groups'
*/
router.get('/', groupController.allGroups);

//Gets one group from database
/*
#swagger.tags = ['Groups']
#swagger.description = 'Get a single group by id'
*/
router.get('/:id', groupController.singleGroup);

//Creates a new group
router.post('/',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Create a new group (admin only)'
	#swagger.parameters['body'] = {
		in: 'body',
		description: 'Group payload',
		required: true,
		schema: {
			groupName: 'Friday Night Group',
			winVote: 'None yet'
		}
	}
	#swagger.responses[201] = { description: 'Group created' }
	#swagger.responses[403] = { description: 'Admin access required' }
	*/
	isAdmin,
	groupController.createGroup
);

//Join group as current logged-in user
router.post('/:id/join',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Join a group as the currently logged-in user'
	#swagger.responses[200] = { description: 'Joined group successfully' }
	#swagger.responses[401] = { description: 'Not authenticated' }
	*/
	isAuthenticated,
	groupController.joinGroup
);

//Updates group
router.put('/:id', groupController.updateGroup);

//Delete group
router.delete('/:id', groupController.deleteGroup);

module.exports = router;