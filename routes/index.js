// Code for routes
const express = require('express');
const router = express.Router();
const { getDb } = require('../DB/connect');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use('/movies', require('./movies'));
router.use('/auth', require('./auth'));
router.use('/api/groups', require('./groups'));
router.use('/games', require('./games'));

const getMyGroups = (groups, currentUserId) => {
    if (!currentUserId || !Array.isArray(groups)) {
        return [];
    }

    return groups.filter((group) =>
        Array.isArray(group.members)
        && group.members.some((memberId) => memberId?.toString?.() === currentUserId)
    );
};

//@desc     Login/Landing page
//@route    GET /
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'mainLayout'
    });
})

//@desc     Register page
//@route    GET /register
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'mainLayout'
    });
})

// Get all users (admin only)
router.get('/users',
    /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Get a list of all users (admin only)'
    #swagger.responses[200] = { description: 'List of users' }
    #swagger.responses[403] = { description: 'Admin only' }
    */
    isAdmin,
    async (req, res) => {
        try {
            const users = await getDb().collection('users').find({}, {
                projection: {
                    username: 1,
                    email: 1,
                    roleID: 1,
                    createdAt: 1
                }
            }).toArray();

            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({ error: err.message || 'Failed to fetch users' });
        }
    }
);


//@desc     Dashboard
//@route    GET /dashboard
router.get('/dashboard', isAuthenticated, async (req,res) => {
    try {
        const userProfile = {
            username: req.user?.username || 'Unknown User',
            email: req.user?.email || 'No email available'
        };
        const isAdmin = req.user?.roleID === 2;
        let allUsers = [];

        if (isAdmin) {
            allUsers = await getDb().collection('users').find({}, {
                projection: {
                    username: 1,
                    email: 1,
                    roleID: 1
                }
            }).toArray();

            allUsers = allUsers.map((user) => ({
                ...user,
                roleLabel: user.roleID === 2 ? 'Admin' : 'Member'
            }));
        }

        res.render('dashboard', { userProfile, isAdmin, allUsers });
    } catch (err) {
        res.status(500).render('dashboard', { error: 'Failed to load dashboard' });
    }
});

//@desc     Home
//@route    GET /home
router.get('/', async (req,res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        const games = await getDb().collection('games').find().toArray();
        res.render('home', { movies, games });
    } catch (err) {
        res.status(500).render('home', { error: 'Failed to load movies' });
    }
});

const renderGroupsPage = async (req, res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        const games = await getDb().collection('games').find().toArray();
        const canViewGroups = typeof req.isAuthenticated === 'function' && req.isAuthenticated();
        const currentUserId = req.user?._id?.toString();
        const isAdmin = req.user && req.user.roleID === 2;
        let groups = [];

        if (canViewGroups) {
            const users = await getDb().collection('users').find({}, {
                projection: {
                    username: 1,
                    roleID: 1
                }
            }).toArray();

            const usersById = new Map(
                users.map((user) => [user._id?.toString(), user])
            );

            groups = await getDb().collection('groups').find().toArray();
            groups = groups.filter(g => g && g.groupName && typeof g.groupName === 'string' && g.groupName.trim() !== '').map(g => ({
                ...g,
                groupName: g.groupName.trim(),
                memberCount: Array.isArray(g.members) ? g.members.length : 0,
                isFinished: Boolean(g.isFinished),
                winningActivity: g.winningActivity || null,
                isMember: Boolean(
                    currentUserId
                    && Array.isArray(g.members)
                    && g.members.some((id) => id?.toString?.() === currentUserId)
                ),
                memberDetails: Array.isArray(g.members)
                    ? g.members.map((memberId) => {
                        const user = usersById.get(memberId?.toString?.());
                        return {
                            username: user?.username || 'Unknown User',
                            roleLabel: user?.roleID === 2 ? 'Admin' : 'Member'
                        };
                    })
                    : [],
                activities: Array.isArray(g.activities)
                    ? g.activities.map((activity) => ({
                        ...activity,
                        activityIdString: activity.activityId?.toString?.() || '',
                        voteCount: Number(activity.voteCount) || 0,
                        votedByCurrentUser: Boolean(
                            currentUserId
                            && Array.isArray(activity.votedUserIds)
                            && activity.votedUserIds.some((voterId) => voterId?.toString?.() === currentUserId)
                        )
                    }))
                    : []
            })).map((group) => ({
                ...group,
                totalVotes: Array.isArray(group.activities)
                    ? group.activities.reduce((sum, activity) => sum + (Number(activity.voteCount) || 0), 0)
                    : 0
            }));

            // Finished groups are only visible to members of that group.
            groups = groups.filter((group) => !group.isFinished || group.isMember);
        }

        const myGroups = getMyGroups(groups, currentUserId);
        res.render('groups', { movies, games, groups, myGroups, isAdmin, canViewGroups });
    } catch (err) {
        res.status(500).render('groups', { error: 'Failed to load groups' });
    }
};

router.get('/groups',
    /*
    #swagger.tags = ['Groups']
    #swagger.description = 'Render the groups page'
    */
    renderGroupsPage
);

module.exports = router;