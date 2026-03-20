const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { getDb } = require('../DB/connect');
const ObjectId = require('mongodb').ObjectId;

// Local Strategy - username/password authentication
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            const user = await getDb().collection('users').findOne({ username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
            
        } catch (err) {
            return done(err);
        }
    }
));


// Google OAuth Strategy - handles Google login and account linking
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URI
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            const email = profile.emails[0].value;
            const name = profile.displayName;
        
            // Check if user already linked with Google
            let user = await getDb().collection('users').findOne({ googleId: googleId });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with this email (link accounts)
            user = await getDb().collection('users').findOne({ email: email });

            if (user) {
                await getDb().collection('users').updateOne(
                    { _id: user._id },
                    { $set: {googleId: googleId } }
                );
                return done(null, user);
            }

            // Create new user
            const newUser = {
                username: name,
                email: email,
                password: null,
                googleId: googleId,
                roleID: 1,
                createdAt: new Date()
            };

            const result = await getDb().collection('users').insertOne(newUser);
            newUser._id = result.insertedId;
            return done(null, newUser);
            
        } catch (err) {
            return done(err);
        }
    }
))


// Serialize user - store user ID in session
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

// Deserialize user - load user from session ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;