// Code for routes
const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/movies', require('./movies'));
router.use('/groups', require('./groups'));
router.use('/games', require('./games'));

//@desc     Login/Landing page
//@route    GET /
router.get('/', (req, res) => {
    res.render('login', {
        layout: 'login',
    });
})

//@desc     Dashboard
//@route    GET /dashboard
router.get('/dashboard', (req,res) => {
    res.render('dashboard');
});

module.exports = router;