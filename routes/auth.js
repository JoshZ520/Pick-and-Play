const router = require('express').Router();
const userController = require('../controllers/users');
const passport = require('passport');

// Register new user
router.post('/register', 
    /* 
    #swagger.tags = ['Authentication']
    #swagger.description = 'Register a new user account'
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
    #swagger.tags = ['Authentication']
    #swagger.description = 'Authenticate user with email and password'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials',
        required: true,
        schema: {
            email: "test@test.com",
            password: "password123"
        }
    }
    */
    passport.authenticate('local', { 
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: false
    })
);

// Logout user
router.post('/logout',
    /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Log out the currently authenticated user'
    */
    userController.logout);

// Get current logged-in user info
router.get('/me',
    /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Get the currently authenticated user profile'
    */
    userController.getCurrentUser);

// Google OAuth - initiate login
router.get('/google',
    /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Initiate Google OAuth login - redirects to Google login page'
    #swagger.responses[302] = { description: 'Redirect to Google OAuth' }
    */
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

// Google OAuth - callback after user authorizes
router.get('/google/callback',
    /*
    #swagger.tags = ['Authentication']
    #swagger.description = 'Google OAuth callback - handles response from Google'
    #swagger.responses[302] = { description: 'Redirect to dashboard on success or login on failure' }
    */
    passport.authenticate('google', { 
        failureRedirect: '/login' 
    }),
    (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect('/dashboard');
    }
);

module.exports = router;
