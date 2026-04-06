const router = require('express').Router();

const movieController = require('../controllers/movies');
const { isAdmin } = require('../middleware/auth');

// Protected Routes (Admin Only)

// Create a new movie
router.post('/',
	/*
	#swagger.tags = ['Movies']
	#swagger.description = 'Create a new movie (admin only)'
	*/
	isAdmin, movieController.createNewMovie);

// Update movie information
router.put('/:id',
	/*
	#swagger.tags = ['Movies']
	#swagger.description = 'Update a movie by id (admin only)'
	*/
	isAdmin, movieController.updateMovie);

// Delete movie
router.delete('/:id',
	/*
	#swagger.tags = ['Movies']
	#swagger.description = 'Delete a movie by id (admin only)'
	*/
	isAdmin, movieController.deleteMovie);

// Public Routes (Anyone Can Access)

// Get all movies
router.get('/',
	/*
	#swagger.tags = ['Movies']
	#swagger.description = 'Get all movies'
	*/
	movieController.allMovies);

// Get single movie by ID
router.get('/:id',
	/*
	#swagger.tags = ['Movies']
	#swagger.description = 'Get a single movie by id'
	*/
	movieController.singleMovie);

module.exports = router;