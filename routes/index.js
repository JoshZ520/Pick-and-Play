// Code for routes
const express = require('express');
const router = express.Router();
const { getDb } = require('../DB/connect');
const { isAuthenticated } = require('../middleware/auth');

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


//@desc     Dashboard
//@route    GET /dashboard
router.get('/dashboard', isAuthenticated, async (req,res) => {
    try {
        const userProfile = {
            username: req.user?.username || 'Unknown User',
            email: req.user?.email || 'No email available'
        };
        const isAdmin = req.user?.roleID === 2;
        res.render('dashboard', { userProfile, isAdmin });
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
            groups = await getDb().collection('groups').find().toArray();
            groups = groups.filter(g => g && g.groupName && typeof g.groupName === 'string' && g.groupName.trim() !== '').map(g => ({
                ...g,
                groupName: g.groupName.trim(),
                winVote: g.winVote ?? 0,
                isFinished: Boolean(g.isFinished),
                winningActivity: g.winningActivity || null,
                isMember: Boolean(
                    currentUserId
                    && Array.isArray(g.members)
                    && g.members.some((id) => id?.toString?.() === currentUserId)
                ),
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