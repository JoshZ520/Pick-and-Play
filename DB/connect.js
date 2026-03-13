const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('Db is already initialized');
        return callback(null, _db);
    }
    MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
        _db = client.db('Activities');
        callback(null, _db);
        console.log("it worked");
    })
    .catch((err) => {
        callback(err);
        console.log("it did not");
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




