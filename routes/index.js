// Code for routes
const express = require('express');
const router = express.Router();
const { getDb } = require('../DB/connect');

router.use('/movies', require('./movies'));
router.use('/auth', require('./auth'));
router.use('/groups', require('./groups'));
router.use('/games', require('./games'));

//@desc     Dashboard
//@route    GET /dashboard
router.get('/dashboard', async (req,res) => {
    try {
        const movies = await getDb().collection('movies').find().toArray();
        res.render('dashboard', { movies });
    } catch (err) {
        res.status(500).render('dashboard', { error: 'Failed to load movies' });
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
        res.render('activities', { movies, games });
    } catch (err) {
        res.status(500).render('activities', { error: 'Failed to load movies and games' });
    }
});

module.exports = router;