const { getDb } = require('../DB/connect');
const { ObjectId } = require('mongodb');
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

const updateUserRole = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid user id' });
    }

    const nextRoleId = Number(req.body?.roleID);
    if (![1, 2].includes(nextRoleId)) {
        return res.status(400).json({ error: 'Role must be 1 (Member) or 2 (Admin)' });
    }

    try {
        const result = await getDb().collection('users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { roleID: nextRoleId } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User role updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Failed to update user role' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    updateUserRole
};
