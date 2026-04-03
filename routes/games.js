const router = require('express').Router();

const gameController = require('../controllers/games');
const { isAdmin } = require('../middleware/auth');

// Public routes
// Get all games
router.get('/', gameController.allGames);

// Get one game by id
router.get('/:id', gameController.singleGame);

// Protected routes (Admin only)
// Create a new game
router.post('/', isAdmin, gameController.createGame);

// Update game
router.put('/:id', isAdmin, gameController.updateGame);

// Delete game
router.delete('/:id', isAdmin, gameController.deleteGame);

module.exports = router;