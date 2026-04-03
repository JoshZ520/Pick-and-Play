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
            votes: req.body.votes || 0,  // Default to 0 if not provided
            winVote: req.body.winVote || 0,  // Default to 0 if not provided
            membersID: req.body.membersID || [],  // Optional array of member IDs or names
            activitiesID: req.body.activitiesID || []  // Optional array to store associated activities (movies/games)
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
        const groupUpdates = {
            groupName: req.body.groupName,
            votes: req.body.votes,
            winVote: req.body.winVote,
            membersID: req.body.members,
            activitiesID: req.body.activities
        }
        const result = await getDb().collection('groups').updateOne({ _id: groupId }, { $set: groupUpdates });
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

const btnCreateGroup = async (req, res, next) => {
    try {
        console.log('Group create body:', req.body);
        const groupName = req.body?.groupName?.trim() || '';
        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required' });
        }
        const newGroup = {
            groupName: groupName,
            votes: 0,   // Per swagger schema
            winVote: 1,  // Per swagger schema
            members: [],  // Per swagger schema
            activities: [] // Optional array to store associated activities (movies/games)
        };
        const result = await getDb().collection('groups').insertOne(newGroup);
        if (result.acknowledged) {
            res.status(201).json({ message: 'Group created successfully', insertedId: result.insertedId });
        } else {
            res.status(500).json({ message: 'Failed to create group' });
        }
    } catch (err) {
        console.error('Create group error:', err);
        res.status(500).json({ message: err.message });
    }
};

const deleteBtnGroup = async (req, res, next) => {
    try {
        console.log('Group delete body:', req.body);
        const groupId = req.body?.groupId?.trim() || '';
        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }
        if (!ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID format' });
        }
        const dbGroupId = new ObjectId(groupId);
        const result = await getDb().collection('groups').deleteOne({ _id: dbGroupId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Group deleted successfully' });
        } else {
            res.status(404).json({ message: 'No group found to delete' });
        }
    } catch (err) {
        console.error('Delete group error:', err);
        res.status(500).json({ message: err.message });
    }
};

const joinGroup = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id' });
    }

    const groupId = new ObjectId(req.params.id);
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const result = await getDb().collection('groups').updateOne(
            { _id: groupId },
            { $addToSet: { members: userId } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        return res.status(200).json({ message: 'Joined group successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    allGroups,
    singleGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    btnCreateGroup,
    deleteBtnGroup,
    joinGroup
};