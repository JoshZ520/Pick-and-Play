// Code for the server app here
test
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const mongodb = require('./DB/connect');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
/* ---Not yet created files for swagger*/
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;

// Dynamic Swagger host based on environment
if (process.env.NODE_ENV === 'production') {
    swaggerDocument.host = 'pick-and-play-mic3.onrender.com';
    swaggerDocument.schemes = ['https'];
} else {
    swaggerDocument.host = `localhost:${PORT}`;
}

const app = express();
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'mainLayout',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', '.hbs');

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))  // Parse form data
    // Session Configuration
   
    // This creates and manages session cookies for user authentication
    .use(session({
        secret: process.env.SESSION_SECRET || 'secret-key',  // Used to sign the session ID cookie
        resave: false,              // Don't save session if nothing changed
        saveUninitialized: false,   // Don't create session until something stored
        // Note: Using default memory store for development
        // Sessions will be lost on server restart (that's OK for testing)
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,  // Session expires after 24 hours (in milliseconds)
            httpOnly: true,                // Can't access cookie via JavaScript (security)
            secure: false,  // Set to true with HTTPS in production
            sameSite: 'lax'               // CSRF protection
        }
    }))
    // Passport Initialization
    // Must come AFTER session middleware
    .use(passport.initialize())  // Initialize Passport
    .use(passport.session())     // Use Passport for session management
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use(cors({
        origin: "https://pick-and-play-mic3.onrender.com",
        headers: ["Content-Type"],
        credentials: true,
    }))
    .use('/', require('./routes/index'));
app.use(express.static(path.join(__dirname, 'public')));


/* ----Deals with MongoDB--------*/
mongodb.initDb ((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT);
        console.log(`Connected to Database and Server: http://localhost:${PORT}`);
    }
});
