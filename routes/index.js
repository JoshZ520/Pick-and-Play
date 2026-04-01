// Code for routes
const express = require('express');
const router = express.Router();
const { getDb } = require('../DB/connect');

router.use('/movies', require('./movies'));
router.use('/auth', require('./auth'));
router.use('/groups', require('./groups'));
router.use('/games', require('./games'));

//@desc     Login/Landing page
//@route    GET /
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'mainLayout',
    });
})

//@desc     Register page
//@route    GET /register
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'mainLayout',
    });
})


//@desc     Dashboard
//@route    GET /dashboard
router.get('/dashboard', async (req,res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        const games = await getDb().collection('games').find().toArray();
        let groups = await getDb().collection('groups').find().toArray();
        groups = groups.filter(g => g && g.groupName && typeof g.groupName === 'string' && g.groupName.trim() !== '').map(g => ({
            ...g,
            groupName: g.groupName.trim(),
            winVote: g.winVote ?? 0
        }));
        res.render('dashboard', { movies, games, groups });
    } catch (err) {
        res.status(500).render('dashboard', { error: 'Failed to load activities' });
    }
});

//@desc     Home
//@route    GET /home
router.get('/', async (req,res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        res.render('home', { movies });
    } catch (err) {
        res.status(500).render('home', { error: 'Failed to load movies' });
    }
});

router.get('/activities', async (req,res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        const games = await getDb().collection('games').find().toArray();
        let groups = await getDb().collection('groups').find().toArray();
        groups = groups.filter(g => g && g.groupName && typeof g.groupName === 'string' && g.groupName.trim() !== '').map(g => ({
            ...g,
            groupName: g.groupName.trim(),
            winVote: g.winVote ?? 0
        }));
        res.render('activities', { movies, games, groups });
    } catch (err) {
        res.status(500).render('activities', { error: 'Failed to load activities' });
    }
});

module.exports = router;