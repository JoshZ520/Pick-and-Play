const router = require('express').Router();

const gameController = require('../controllers/games');

//Gets all groups
router.get('/', gameController.allGames);

//Gets one group from database
router.get('/:id', gameController.singleGame);

//Creates a new group
router.post('/', gameController.createGame);

//Updates group
router.put('/:id', gameController.updateGame);

//Delete group
router.delete('/:id', gameController.deleteGame);

module.exports = router;