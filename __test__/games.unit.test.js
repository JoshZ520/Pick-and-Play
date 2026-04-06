const gameController = require('../controllers/games');
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

// Mock the getDb function to return a mock database object
jest.mock('../DB/connect', () => ({
    getDb: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('allGames returns list with status 200', async () => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ title: 'A' }, { title: 'B' }])
    };
    getDb.mockReturnValue(DBMock);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameController.allGames(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'A' })]));
});

test('singleGame returns 200 when game exists', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ _id: new ObjectId(id), title: 'Found'}])
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameController.singleGame(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Found' }));
});

test('createGame returns 201 on success', async() => {
    const newGameId = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: new ObjectId(newGameId) })
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { title: 'Monopoly', genre: 'Board Game', playtime: '1-2 hours', minPlayers: 2, maxPlayers: 6, description:'A classic board game where players buy and trade properties to bankrupt their opponents.', imageURL:'https://example.com/monopoly.jpg' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameController.createGame(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ acknowledged: true, insertedId: new ObjectId(newGameId) }));
});

test('updateGame returns 204 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        replaceOne: jest.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 1 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id }, body: { title: 'Updated Game', genre: 'Board Game', playtime: '1-2 hours', minPlayers: 2, maxPlayers: 6, description:'An updated classic board game.', imageURL:'https://example.com/updated-monopoly.jpg' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    
    await gameController.updateGame(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
});

test('updateGame returns 404 when game not found', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        replaceOne: jest.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 0 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id }, body: { title: 'Updated Game', genre: 'Board Game', playtime: '1-2 hours', minPlayers: 2, maxPlayers: 6, description:'An updated classic board game.', imageURL:'https://example.com/updated-monopoly.jpg' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameController.updateGame(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No games found to update' }));
})

test('deleteGame returns 200 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        deleteOne: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1})
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    await gameController.deleteGame(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith();
});

test('deleteGame returns 404 when game not found', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        deleteOne: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 0 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await gameController.deleteGame(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No game found to delete' }));
}
);