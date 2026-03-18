const router = require('express').Router();

const movieController = require('../controllers/movies');
const { isAdmin } = require('../middleware/auth');

// Protected Routes (Admin Only)

// Create a new movie
router.post('/', isAdmin, movieController.createNewMovie);

// Update movie information
router.put('/:id', isAdmin, movieController.updateMovie);

// Delete movie
router.delete('/:id', isAdmin, movieController.deleteMovie);

// Public Routes (Anyone Can Access)

// Get all movies
router.get('/', movieController.allMovies);

// Get single movie by ID
router.get('/:id', movieController.singleMovie);

module.exports = router;