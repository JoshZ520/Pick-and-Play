// Code for the server app here
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
/* ---Not yet created files for swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
*/

const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 1000;

const app = express();
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app
    // .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocuments))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use('/', require('./routes/index'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);

/* ----Deals with MongoDB--------
mongodb.initDb ((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT);
        console.log(`Connected to Database and listening on port ${PORT}`);
    }
});
*/