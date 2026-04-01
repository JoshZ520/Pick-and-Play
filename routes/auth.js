const router = require('express').Router();
const userController = require('../controllers/users');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { getDb } = require('../DB/connect');

// ===== TESTING ENDPOINT - Remove in production =====
// GET /auth/create-test-user - Creates a test user for easy testing
router.get('/create-test-user', async (req, res) => {
    try {
        const testUser = {
            username: 'testuser',
            email: 'test@test.com',
            password: await bcrypt.hash('Password123!', 10),
            roleID: 1,
            createdAt: new Date()
        };
        
        // Check if test user already exists
        const existing = await getDb().collection('users').findOne({ email: testUser.email });
        if (existing) {
            return res.json({ 
                message: 'Test user already exists', 
                credentials: { email: 'test@test.com', password: 'Password123!' }
            });
        }
        
        await getDb().collection('users').insertOne(testUser);
        res.json({ 
            message: 'Test user created successfully!',
            credentials: { email: 'test@test.com', password: 'Password123!' }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ===== END TESTING ENDPOINT =====

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
        failureRedirect: '/login' 
    }),
    (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect('/dashboard');
    }
);

module.exports = router;
