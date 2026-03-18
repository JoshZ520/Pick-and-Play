// Code for routes
const express = require('express');
const router = express.Router();
const { getDb } = require('../DB/connect');

router.use('/', require('./swagger'));
router.use('/movies', require('./movies'));

//@desc     Login/Landing page
//@route    GET /
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'mainLayout',
    });
})

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

module.exports = router;