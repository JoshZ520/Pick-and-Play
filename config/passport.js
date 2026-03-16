const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

// ============================================
// STEP 1: Configure the Local Strategy
// ============================================
// This tells Passport HOW to authenticate users with username/password

passport.use(new LocalStrategy(
    {
        usernameField: 'username',  // The field name in req.body for username
        passwordField: 'password'    // The field name in req.body for password
    },
    async (username, password, done) => {
        // This function runs whenever someone tries to login
        // Parameters:
        //   - username: from req.body.username
        //   - password: from req.body.password (plain text!)
        //   - done: callback function to signal success/failure
        
        try {
            // Step 1.1: Find user by username in MongoDB
            const user = await getDb().collection('users').findOne({ username });

            // Step 1.2: If user doesn't exist, authentication fails
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            // Step 1.3: Compare the plain-text password with hashed password
            const isValidPassword = await bcrypt.compare(password, user.password);

            // Step 1.4: If password doesn't match, authentication fails
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password' });
            }

            // Step 1.5: Success! Return the user object
            return done(null, user);
            
        } catch (err) {
            // Database error or other unexpected error
            return done(err);
        }
    }
));

// ============================================
// STEP 2: Serialize User (Save to Session)
// ============================================
// After successful login, this runs to decide what to store in the session cookie
// We only store the user ID (not the whole user object) to keep cookies small

passport.serializeUser((user, done) => {
    // Store only the user's ID as a string in the session
    done(null, user._id.toString());
});

// ============================================
// STEP 3: Deserialize User (Load from Session)
// ============================================
// On every request, this runs to load the full user from the ID in the session

passport.deserializeUser(async (id, done) => {
    try {
        // Convert the ID string back to MongoDB ObjectId and fetch the user
        const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;