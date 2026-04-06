const groupController = require('../controllers/groups.js');
const { getDb } = require('../DB/connect.js');
const ObjectId = require('mongodb').ObjectId;

jest.mock('../DB/connect.js', () => ({
    getDb: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('allGroups returns list with status 200', async () => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ groupName: 'Group A' }, { groupName: 'Group B'}])
    };
    getDb.mockReturnValue(DBMock);
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await groupController.allGroups(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ groupName: 'Group A' }), expect.objectContaining({ groupName: 'Group B' })]));
});

test('singleGroup returns 200 when group exists', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([{ _id: new ObjectId(id), groupName: 'Found'}])
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await groupController.singleGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ groupName: 'Found' }));
});

test('createGroup returns 201 on success', async() => { 
    const newGroupId = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: new ObjectId(newGroupId) })
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { groupName: 'New Group', winVote: 'Game A' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await groupController.createGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ acknowledged: true, insertedId: new ObjectId(newGroupId) }));
});

test('updateGroup returns 204 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        updateOne: jest.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 1 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id }, body: { groupName: 'Updated Group', winVote: 'Game B' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    await groupController.updateGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
});

test('deleteGroup returns 200 on success', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        deleteOne: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    await groupController.deleteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith();
});

test('createGroup returns 500 on database error', async() => {
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        insertOne: jest.fn().mockRejectedValue(new Error('Some error occurred while creating the group'))
    };
    getDb.mockReturnValue(DBMock);
    const req = { body: { groupName: 'New Group', winVote: 'Game A' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await groupController.createGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Some error occurred while creating the group' }));
});

test('updateGroup returns 500 on database error', async() => {
    const id = new ObjectId().toHexString();
    const DBMock = {
        collection: jest.fn().mockReturnThis(),
        updateOne: jest.fn().mockRejectedValue(new Error('Some error occurred while updating the group'))
    };
    getDb.mockReturnValue(DBMock);
    const req = { params: { id }, body: { groupName: 'Updated Group', winVote: 'Game B' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await groupController.updateGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Some error occurred while updating the group' }));
});
