usersController = require('../controllers/users');
const { getDb } = require('../DB/connect.js');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../DB/connect.js', () => ({
    getDb: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('register returns 400 if required fields are missing', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Username, email, and password are required ' }));
})

test('register returns 400 if username or email already exists', async () => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue({ username: 'extinguishedUser', email: 'existing@example.com' })
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { username: 'extinguishedUser', email: 'existing@example.com', password: 'password123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Username or email already exists' }));
});

test('register returns 500 on database error', async () => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockRejectedValue(new Error('Database error'))
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { username: 'newUser', email: 'newuser@example.com', password: 'password123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));    
});


test('register returns 201 on successful registration', async () => {
    const newUserId = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: new ObjectId(newUserId) })
    };
    getDb.mockReturnValue(DBMock);
    const req = {
        body: { username: 'newUser', email: 'newuser@example.com', password: 'password123' },
        login: jest.fn((user, cb) => cb())
    };
    const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.register(req, res);
    expect(req.login).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/dashboard');
});


test('login returns 200 with user data on successful login', async () => {
    const req = { user: { username: 'loggedInUser', email: 'loggedin@example.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Login successful', user: { email: 'loggedin@example.com', id: undefined, roleID: undefined,  username: 'loggedInUser', }}));
});



test('logout returns 200 on successful logout', async () => {
    const req = {};
    req.session = { destroy: jest.fn(cb => cb()) };
    req.logout = jest.fn(cb => cb());
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.logout(req, res);
    expect(req.logout).toHaveBeenCalled();
    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Logout successful' }));
});

test('getCurrentUser returns 200 with user data if authenticated', async () => {
    const req = { isAuthenticated: () => true, user: { username: 'currentUser', email: 'currentUser@test.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await usersController.getCurrentUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { email: 'currentUser@test.com', id: undefined, roleID: undefined, username: 'currentUser' } }));
});

