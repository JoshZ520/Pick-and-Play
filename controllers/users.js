const { getDb } = require('../DB/connect');
const bcrypt = require('bcrypt');

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required '});
        }

        const existingUser = await getDb().collection('users').findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            username,
            email,
            password: hashedPassword, // Use the hashed password here
            roleID: 1, // 1 = regular user, 2 = admin
            createdAt: new Date()
        };

    const result = await getDb().collection('users').insertOne(newUser);

        if (result.acknowledged) {
            // Add the inserted ID to the user object
            newUser._id = result.insertedId;
            
            // Automatically log the user in after registration
            req.login(newUser, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Registration successful but login failed' });
                }
                // Redirect to dashboard after successful login
                res.redirect('/dashboard');
            });
        } else {
            res.status(500).json({ error: 'Failed to register'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message || 'Error occurred during registration' });
    }
};

// Login user
const login = async (req, res) => {
    // NOTE: Passport will handle authentication before this runs
    // If we reach here, req.user will contain the authenticated user
    res.status(200).json({ 
        message: 'Login successful',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            roleID: req.user.roleID
        }
    });
};

// Logout user
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        // For API calls, return JSON success
        // Session is destroyed, redirect happens on client side
        res.status(200).json({ message: 'Logout successful' });
    });
};

// Get current user info (for protected routes)
const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                roleID: req.user.roleID
            }
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};
