const router = require('express').Router();

const movieController = require('../controllers/movies');

//Gets all movies
router.get('/', movieController.allMovies);

//Gets one movie from database
router.get('/:id', movieController.singleMovie);

//Creates a new movie
router.post('/', movieController.createNewMovie);

//Updates movie information
router.put('/:id', movieController.updateMovie);

//Delete movie information
router.delete('/:id', movieController.deleteMovie);

module.exports = router;