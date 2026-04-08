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
	#swagger.description = 'Create a new group'
	#swagger.parameters['body'] = {
		in: 'body',
		description: 'Group payload',
		required: true,
		schema: {
			groupName: 'Friday Night Group',
			winVote: 'None yet',
			activities: [
				{
					activityType: 'movie',
					activityId: '507f1f77bcf86cd799439011'
				},
				{
					activityType: 'game',
					activityId: '507f1f77bcf86cd799439012'
				}
			]
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
router.delete('/:id/activities/:activityType/:activityId',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Remove a movie or game from a group'
	#swagger.parameters['id'] = {
		in: 'path',
		description: 'Group id',
		required: true,
		type: 'string'
	}
	#swagger.parameters['activityType'] = {
		in: 'path',
		description: 'Activity type to remove',
		required: true,
		type: 'string',
		enum: ['movie', 'game']
	}
	#swagger.parameters['activityId'] = {
		in: 'path',
		description: 'Activity id to remove',
		required: true,
		type: 'string'
	}
	#swagger.responses[200] = { description: 'Activity removed from group' }
	#swagger.responses[404] = { description: 'Group not found' }
	*/
	isAdmin,
	groupController.removeActivityFromGroup
);

// Vote +1 on a group activity (one vote per user)
router.post('/:id/activities/:activityType/:activityId/vote',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Vote +1 on a group activity. One vote per user per activity.'
	#swagger.responses[200] = { description: 'Vote recorded' }
	#swagger.responses[400] = { description: 'Already voted or group is finished' }
	#swagger.responses[401] = { description: 'Not authenticated' }
	*/
	isAuthenticated, groupController.voteOnActivity);

// Finish voting and lock group
router.post('/:id/finish',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Finish voting for a group and lock it (admin only)'
	#swagger.responses[200] = { description: 'Voting finished and winner determined' }
	#swagger.responses[403] = { description: 'Admin only' }
	*/
	isAdmin, groupController.finishGroupVoting);

// Update group metadata (currently groupName only)
router.patch('/:id',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Update group metadata (admin only). Currently supports groupName.'
	#swagger.parameters['id'] = {
		in: 'path',
		description: 'Group id',
		required: true,
		type: 'string'
	}
	#swagger.parameters['body'] = {
		in: 'body',
		description: 'Allowed update payload',
		required: true,
		schema: {
			groupName: 'Updated Group Name'
		}
	}
	#swagger.responses[200] = { description: 'Group updated successfully' }
	#swagger.responses[400] = { description: 'Invalid group id or payload' }
	#swagger.responses[403] = { description: 'Admin only' }
	#swagger.responses[404] = { description: 'Group not found' }
	*/
	isAdmin,
	groupController.updateGroup
);

// Remove a group member (admin removes anyone, user can remove self)
router.delete('/:id/members/:memberId',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Remove a member from a group. Admin can remove any member. Non-admin can only remove self.'
	#swagger.parameters['id'] = {
		in: 'path',
		description: 'Group id',
		required: true,
		type: 'string'
	}
	#swagger.parameters['memberId'] = {
		in: 'path',
		description: 'Member id to remove',
		required: true,
		type: 'string'
	}
	#swagger.responses[200] = { description: 'Member removed from group' }
	#swagger.responses[400] = { description: 'Invalid group id or member id' }
	#swagger.responses[403] = { description: 'Not allowed to remove this member' }
	#swagger.responses[404] = { description: 'Group or member not found' }
	*/
	isAuthenticated,
	groupController.removeMemberFromGroup
);

// Delete group
router.delete('/:id',
	/*
	#swagger.tags = ['Groups']
	#swagger.description = 'Delete a group by id'
	*/
	groupController.deleteGroup);

module.exports = router;