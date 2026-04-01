const movieController = require('../controllers/movies');
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

// Mock the getDb function to return a mock database object
jest.mock('../DB/connect', () => ({
    getDb: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('allMovies returns list with status 200', async () => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ title: 'A' }, { title: 'B' }])
    };
    getDb.mockReturnValue(DBMock);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await movieController.allMovies(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'A' })]));
});

test('singleMovie returns 200 when movie exists', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ _id: new ObjectId(id), title: 'Found' }])
    };
    getDb.mockReturnValue(DBMock);

    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await movieController.singleMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Found' }));
});

test('CreateNewMovie returns 201 on success', async() => {
    const newMovieId = new ObjectId();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: newMovieId })
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { title: 'The Avengers', genre: 'Action', rating: 'PG-13', runtime: '2h12m', description:'A group of superheroes must come together to stop a global threat.' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await movieController.createNewMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ acknowledged: true, insertedId: newMovieId }));
});

test('UpdateMovie returns 200 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id }, body: { title: 'Updated Movie', genre: 'Action', rating: 'PG-13', runtime: '2h12m', description:'A group of superheroes must come together to stop a global threat.' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    await movieController.updateMovie(req, res);

    expect(DBMock.replaceOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
});

test('deleteMovie returns 200 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
    };
    getDb.mockReturnValue(DBMock);
    const req= { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    await movieController.deleteMovie(req, res);

    expect(DBMock.deleteOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith();
});
