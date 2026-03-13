const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

const allMovies = async (req, res, next) => {
    try {
    const lists = await getDb().collection('movies').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Some error occurred while getting the list of movies' });
    }
};

const singleMovie = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Must use a valid movie id" });
    }
    const movieId = new ObjectId(req.params.id);
    try {
    const lists = await getDb().collection('movies').find({ _id: movieId }).toArray();
        if (!lists.length) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.status(200).json(lists[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNewMovie = async (req, res, next) => {
    try {
        const newMovie = {
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            runtime: req.body.runtime,
            description: req.body.description,
            imageURL: req.body.imageURL
        };
const result = await getDb().collection('movies').insertOne(newMovie);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the movie' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMovie = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Must use a valid movie id" });
    }
    const movieId = new ObjectId(req.params.id);
    try {
        const updateMovie = {
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            runtime: req.body.runtime,
            description: req.body.description,
            imageURL: req.body.imageURL
        };
const result = await getDb().collection('movies').replaceOne({ _id: movieId }, updateMovie);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'No movie found to update' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteMovie = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Must use a valid movie id" });
    }
    const movieId = new ObjectId(req.params.id);
    try {
const result = await getDb().collection('movies').deleteOne({ _id: movieId });
        if (result.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(404).json({ message: 'No movie found to delete' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    allMovies,
    singleMovie,
    createNewMovie,
    updateMovie,
    deleteMovie
}