const router = require('express').Router();
const userController = require('../controllers/users');
const passport = require('passport');

// Login page
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'mainLayout',
    });
});

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
        failureRedirect: '/auth/login' 
    }),
    (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect('/dashboard');
    }
);

module.exports = router;
