const { get } = require('mongoose');
const movieController = require('../controllers/movies');
const { getDb } = require('../DB/connect');
// const { param } = require('../routes');
const ObjectId = require('mongodb').ObjectId;
jest.mock('../DB/connect', () => ({
    getDb: jest.fn()
}));

describe('Test routes', () => {
    test('GET /movies - should return all movies', async () => {
        const req = getDb.mockReturnValue({
            collection: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn().mockResolvedValue([{ title: 'Movie 1' }, { title: 'Movie 2' }])
        });
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await movieController.allMovies(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    test('GET /movies/:id - should return a single movie', async () => {
        if (!ObjectId.isValid()) {
            throw new Error('Invalid ObjectId');
        }
        // let id = new ObjectId('69bb01ce4d28b1c27293baee');
        // const req = getDb.mockReturnValue({
        //     collection: jest.fn().mockReturnThis(),
        //     find: jest.fn().mockReturnThis(), 
        //     params: { id: id },
        //     toArray: jest.fn().mockResolvedValue([{ title: 'any' }])
        // });
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn()
        // };
        // await movieController.singleMovie(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalled();
        // const movieId = new ObjectId('69bb01ce4d28b1c27293baee');
        // const req = getDb.mockReturnValue({
        //     collection: jest.fn().mockReturnThis(),
        //     find: jest.fn().mockReturnThis(),
        //     params: { id: movieId },
        //     toArray: jest.fn().mockResolvedValue([{ title: 'Movie 1' }, { title: 'Movie 2' }])
        // });
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn()
        // };
        // await movieController.singleMovie(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalled();
    });    
});
// test('Handler works correctly', () => {
//     // Test implementation
//     expect(true).toBe(true);
// });
