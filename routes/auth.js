const router = require('express').Router();
const userController = require('../controllers/users');
const passport = require('passport');

// Register new user
router.post('/register', userController.register);

// Login user - Passport authenticates before calling controller
router.post('/login', 
    passport.authenticate('local', { 
        failureMessage: true 
    }), 
    userController.login
);

// Logout user
router.post('/logout', userController.logout);

// Get current logged-in user info
router.get('/me', userController.getCurrentUser);

module.exports = router;
