//GAMES CONTROLLER
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

const allGames = async (req, res, next) => {
    try {
        const lists = await getDb().collection('games').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({message: err.message || 'Some error occurred while getting the list of games.'});
    }
};

const singleGame = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid game id'});
    }
    const gameId = new ObjectId(req.params.id);

    try {
        const lists = await getDb().collection('games').find({ _id: gameId}).toArray();
        if (!lists.length) {
            return res.status(404).json({ error: 'Game not found'});
        }
        res.status(200).json(lists[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGame = async (req, res, next) => {
    try {
        const newGame = {
            title: req.body.title,
            genre: req.body.genre,
            playtime: req.body.playtime,
            minPlayers: req.body.minPlayers,
            maxPlayers: req.body.maxPlayers,
            description: req.body.description,
            imageURL: req.body.imageURL
        };

        const result = await getDb().collection('games').insertOne(newGame);
        if (result.acknowledge) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the game' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateGame = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid game id'});
    }

    const gameId = new ObjectId(req.params.id);
    try {
        const updateGame = {
            title: req.body.title,
            genre: req.body.genre,
            playtime: req.body.playtime,
            minPlayers: req.body.minPlayers,
            maxPlayers: req.body.maxPlayers,
            description: req.body.description,
            imageURL: req.body.imageURL
        }
        const result = await getDb().collection('games').replaceOne({ _id: gameId}, updateGame);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'No games found to update' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteGame = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid game id'});
    }

    const gameId = new ObjectId(req.params.id);

    try {
        const result = await getDb().collection('games').deleteOne({ _id: gameId});
        if (result.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(404).json({message: 'No game found to delete'});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    allGames,
    singleGame,
    createGame,
    updateGame,
    deleteGame
}