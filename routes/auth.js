const router = require('express').Router();
const userController = require('../controllers/users');
const passport = require('passport');

// Register new user
router.post('/register', 
    /* 
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User registration',
        required: true,
        schema: {
            username: "testuser",
            email: "test@example.com",
            password: "password123"
        }
    }
    */
    userController.register
);

// Login user - Passport authenticates before calling controller
router.post('/login', 
    /* 
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials',
        required: true,
        schema: {
            username: "testuser",
            password: "password123"
        }
    }
    */
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
