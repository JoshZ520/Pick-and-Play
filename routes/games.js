const router = require('express').Router();

const gameController = require('../controllers/games');
const { isAdmin } = require('../middleware/auth');

// Public routes
// Get all games
router.get('/',
	/*
	#swagger.tags = ['Games']
	#swagger.description = 'Get all games'
	*/
	gameController.allGames);

// Get one game by id
router.get('/:id',
	/*
	#swagger.tags = ['Games']
	#swagger.description = 'Get a single game by id'
	*/
	gameController.singleGame);

// Protected routes (Admin only)
// Create a new game
router.post('/',
	/*
	#swagger.tags = ['Games']
	#swagger.description = 'Create a new game (admin only)'
	*/
	isAdmin, gameController.createGame);

// Update game
router.put('/:id',
	/*
	#swagger.tags = ['Games']
	#swagger.description = 'Update a game by id (admin only)'
	*/
	isAdmin, gameController.updateGame);

// Delete game
router.delete('/:id',
	/*
	#swagger.tags = ['Games']
	#swagger.description = 'Delete a game by id (admin only)'
	*/
	isAdmin, gameController.deleteGame);

module.exports = router;