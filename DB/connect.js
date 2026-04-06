const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
    if (_db) {
        return callback(null, _db);
    }
    if (!process.env.MONGO_URI) {
        const error = new Error('MONGO_URI environment variable is missing. Create .env file with: MONGO_URI=mongodb://localhost:27017/Activities');
        callback(error);
        console.error(error.message);
        return;
    }
    MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
        _db = client.db('Activities');
        callback(null, _db);
    })
    .catch((err) => {
        callback(err);
    });
};

const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    return _db;
};

module.exports = {
    initDb,
    getDb
};




