const mongodb = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

const allMovies = async(req, res, next) => {
    try {
        const result = await mongodb.getDB().collection('movies').find();
        result.toArray((err, lists) => {
            if (err) {
                res.status(400).json({message:err});
            }
        })
        .then((lists)=> {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch(err) {
        res.status(500).json(err.message || 'Some error occured while getting the list of movies');
    }
};

const singleMovie = async(req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({error: "Must be a valid movie id to find a movie."});
    }
    const movieId = new ObjectId(req.params.id);
    try {
        const result = await mongodb
            .getDB()
            .collection('movies')
            .find({_id: movieId});
        result.toArray((err, lists) => {
            if(err) {
                res.status(400).json({message:err});
            }
        })
        .then((lists) => {
            if(!lists[0]) {
                return res.status(404).json({ error: "Movie not found"});
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        });
    } catch(error) {
        console.log(error.message);
        next(error);
    }
};

const createNewMovie = async(req, res, next) => {
    try {
        const newMovie = {
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            runtime: req.body.runtime,
            description: req.body.description,
            imageURL: req.body.imageURL
        };

        const result = await mongodb.getDB().collection('movies').insertOne(newMovie);
        if(result.acknowledged) {
            res.status(201).json(result);
            console.log('It worked!!!!');
        } else {
            res.status(500).json(result.err || 'Some error occured while making the movie');
        }
    } catch(err) {
        res.status(500).json(err);
    }
};

const updateMovie = async(req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({error: "Must be a valid movie id to find a movie."});
    }

    try {
        const movieId = new ObjectId(req.params.id);
        const updateMovie = {
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            runTime: req.body.runtime,
            description: req.body.description,
            imageURL: req.body.imageURL
        };
        const result = await mongodb.getDB().collection('movies').replaceOne({_id: movieId}, updateMovie);
        console.log(result);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(result.error || 'Some error occurred while updating the movie');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteMovie = async(req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).json({error: "Must be a valid movie id to find a movie."});
        }

        const movieId = new ObjectId(req.params.id);
        const result = await mongodb.getDB().collection('movies').deleteOne({_id: movieId});
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(500).json(result.error || 'Some error occurred while deleting the movie');
        }
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports = {
    allMovies,
    singleMovie,
    createNewMovie,
    updateMovie,
    deleteMovie
}