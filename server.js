// Code for the server app here
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const mongodb = require('./DB/connect');
const cors = require('cors');
const bodyParser = require('body-parser');
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
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app
    .use(bodyParser.json())
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    // .use(cors())
    //Fill in Render connection
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
