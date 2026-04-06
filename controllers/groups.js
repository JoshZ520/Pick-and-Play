//GROUPS CONTROLLER
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

const buildActivityEntries = async (rawActivities = []) => {
    const activityRequests = Array.isArray(rawActivities) ? rawActivities : [];
    const uniqueRequests = new Map();

    activityRequests.forEach((activity) => {
        if (!activity) {
            return;
        }

        const activityType = activity.activityType;
        const activityId = activity.activityId?.toString?.() || activity.activityId;

        if (!['movie', 'game'].includes(activityType)) {
            return;
        }

        if (!ObjectId.isValid(activityId)) {
            return;
        }

        uniqueRequests.set(`${activityType}:${activityId}`, {
            activityType,
            activityId
        });
    });

    const entries = await Promise.all(
        Array.from(uniqueRequests.values()).map(async ({ activityType, activityId }) => {
            const collectionName = activityType === 'movie' ? 'movies' : 'games';
            const selectedActivityId = new ObjectId(activityId);
            const activity = await getDb().collection(collectionName).findOne({ _id: selectedActivityId });

            if (!activity) {
                throw Object.assign(new Error(`Selected ${activityType} was not found`), { statusCode: 404 });
            }

            return {
                activityId: selectedActivityId,
                activityType,
                title: activity.title,
                voteCount: 0,
                votedUserIds: []
            };
        })
    );

    return entries;
};

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
        const groupName = req.body.groupName?.trim();
        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        const creatorId = req.user?._id;
        const requestedMembers = Array.isArray(req.body.members) ? req.body.members : [];
        const members = creatorId
            ? [
                creatorId,
                ...requestedMembers.filter((memberId) => memberId?.toString() !== creatorId.toString())
            ]
            : requestedMembers;
        const activities = await buildActivityEntries(req.body.activities);

        const newGroup = {
            groupName,
            votes: req.body.votes || 0,  // Default to 0 if not provided
            winVote: req.body.winVote || 0,  // Default to 0 if not provided
            createdBy: creatorId,
            groupAdminId: creatorId,
            members,
            activities
        };

        const result = await getDb().collection('groups').insertOne(newGroup);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the group' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
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
            {
                $addToSet: {
                    members: userId
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        return res.status(200).json({ message: 'Joined group successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addActivityToGroup = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id' });
    }

    const groupId = new ObjectId(req.params.id);

    try {
        const [activityEntry] = await buildActivityEntries([req.body]);

        if (!activityEntry) {
            return res.status(400).json({ error: 'A valid activity selection is required' });
        }

        const group = await getDb().collection('groups').findOne({ _id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const currentActivities = Array.isArray(group.activities) ? group.activities : [];
        const alreadyExists = currentActivities.some((activity) =>
            activity.activityType === activityEntry.activityType
            && activity.activityId?.toString?.() === activityEntry.activityId.toString()
        );

        if (alreadyExists) {
            return res.status(409).json({ error: 'Activity is already in this group' });
        }

        const updatedActivities = [...currentActivities, activityEntry];

        const result = await getDb().collection('groups').updateOne(
            { _id: groupId },
            {
                $set: {
                    activities: updatedActivities
                }
            }
        );

        return res.status(200).json({ message: 'Activity added to group', activity: activityEntry });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message });
    }
};

const removeActivityFromGroup = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id' });
    }

    if (!['movie', 'game'].includes(req.params.activityType)) {
        return res.status(400).json({ error: 'Activity type must be movie or game' });
    }

    if (!ObjectId.isValid(req.params.activityId)) {
        return res.status(400).json({ error: 'Must use a valid activity id' });
    }

    const groupId = new ObjectId(req.params.id);
    const activityId = new ObjectId(req.params.activityId);

    try {
        const result = await getDb().collection('groups').updateOne(
            { _id: groupId },
            {
                $pull: {
                    activities: {
                        activityType: req.params.activityType,
                        activityId
                    }
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        return res.status(200).json({ message: 'Activity removed from group' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const voteOnActivity = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id' });
    }

    if (!['movie', 'game'].includes(req.params.activityType)) {
        return res.status(400).json({ error: 'Activity type must be movie or game' });
    }

    if (!ObjectId.isValid(req.params.activityId)) {
        return res.status(400).json({ error: 'Must use a valid activity id' });
    }

    const groupId = new ObjectId(req.params.id);
    const activityId = new ObjectId(req.params.activityId);
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const group = await getDb().collection('groups').findOne({ _id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.isFinished) {
            return res.status(409).json({ error: 'Voting is closed for this group' });
        }

        const activities = Array.isArray(group.activities) ? group.activities : [];
        const activityIndex = activities.findIndex((activity) =>
            activity.activityType === req.params.activityType
            && activity.activityId?.toString?.() === activityId.toString()
        );

        if (activityIndex === -1) {
            return res.status(404).json({ error: 'Activity not found in this group' });
        }

        const activity = activities[activityIndex];
        const votedUserIds = Array.isArray(activity.votedUserIds) ? activity.votedUserIds : [];
        const hasVoted = votedUserIds.some((voterId) => voterId?.toString?.() === userId.toString());

        if (hasVoted) {
            return res.status(409).json({ error: 'You already voted for this activity' });
        }

        const updatedActivity = {
            ...activity,
            voteCount: Number(activity.voteCount) + 1 || 1,
            votedUserIds: [...votedUserIds, userId]
        };

        const updatedActivities = [...activities];
        updatedActivities[activityIndex] = updatedActivity;

        await getDb().collection('groups').updateOne(
            { _id: groupId },
            {
                $set: {
                    activities: updatedActivities
                }
            }
        );

        return res.status(200).json({
            message: 'Vote recorded',
            activity: {
                activityId: updatedActivity.activityId,
                activityType: updatedActivity.activityType,
                voteCount: updatedActivity.voteCount
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const finishGroupVoting = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid group id' });
    }

    const groupId = new ObjectId(req.params.id);

    try {
        const group = await getDb().collection('groups').findOne({ _id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.isFinished) {
            return res.status(200).json({ message: 'Group is already finished', winningActivity: group.winningActivity || null });
        }

        const activities = Array.isArray(group.activities) ? group.activities : [];
        if (!activities.length) {
            return res.status(400).json({ error: 'No activities in this group to finish voting' });
        }

        const winningActivity = activities.reduce((best, current) => {
            if (!best) {
                return current;
            }

            return Number(current.voteCount) > Number(best.voteCount) ? current : best;
        }, null);

        const winnerSummary = winningActivity
            ? {
                activityId: winningActivity.activityId,
                activityType: winningActivity.activityType,
                title: winningActivity.title,
                voteCount: Number(winningActivity.voteCount) || 0
            }
            : null;

        await getDb().collection('groups').updateOne(
            { _id: groupId },
            {
                $set: {
                    isFinished: true,
                    winningActivity: winnerSummary
                }
            }
        );

        return res.status(200).json({ message: 'Voting finished', winningActivity: winnerSummary });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    allGroups,
    singleGroup,
    createGroup,
    deleteGroup,
    joinGroup,
    addActivityToGroup,
    removeActivityFromGroup,
    voteOnActivity,
    finishGroupVoting
};
