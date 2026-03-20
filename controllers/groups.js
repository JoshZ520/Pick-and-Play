//GROUPS CONTROLLER
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

const allGroups = async (req, res, next) => {
    try {
        const lists = await getDb().collection('groups').find().toArray();
        res.status(200).json(lists);
    } catch (err) {
        res.status(500).json({message: err.message || 'Some error occurred while getting the list of groups.'});
    }
};

const singleGroup = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id'});
    }
    const groupId = new ObjectId(req.params.id);

    try {
        const lists = await getDb().collection('groups').find({ _id: groupId}).toArray();
        if (!lists.length) {
            return res.status(404).json({ error: 'Group not found'});
        }
        res.status(200).json(lists[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGroup = async (req, res, next) => {
    try {
        const newGroup = {
            groupName: req.body.groupName,
            winVote: req.body.winVote,
        };

        const result = await getDb().collection('groups').insertOne(newGroup);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the group' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateGroup = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id'});
    }

    const groupId = new ObjectId(req.params.id);
    try {
        const updateGroup = {
            groupName: req.body.groupName,
            winVote: req.body.winVote,
        }
        const result = await getDb().collection('groups').replaceOne({ _id: groupId}, updateGroup);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'No group found to update' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteGroup = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id'});
    }

    const groupId = new ObjectId(req.params.id);

    try {
        const result = await getDb().collection('groups').deleteOne({ _id: groupId});
        if (result.deletedCount > 0) {
            res.status(200).send();
        } else {
            res.status(404).json({message: 'No group found to delete'});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    allGroups,
    singleGroup,
    createGroup,
    updateGroup,
    deleteGroup
}