const router = require('express').Router();

const groupController = require('../controllers/groups');
const { isAuthenticated } = require('../middleware/auth');

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
	#swagger.description = 'Create a new group'
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
	*/
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

// Add a movie or game to a group
router.post('/:id/activities',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Add a movie or game to a group'
	#swagger.parameters['body'] = {
		in: 'body',
		description: 'Activity payload',
		required: true,
		schema: {
			activityType: 'movie',
			activityId: '507f1f77bcf86cd799439011'
		}
	}
	*/
	groupController.addActivityToGroup
);

// Remove a movie or game from a group
router.delete('/:id/activities/:activityType/:activityId', groupController.removeActivityFromGroup);

//Updates group
router.put('/:id', groupController.updateGroup);

//Delete group
router.delete('/:id', groupController.deleteGroup);

module.exports = router;