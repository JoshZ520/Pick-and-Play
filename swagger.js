const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Pick-and-Play API',
        description: 'Pick-and-Play API',
    },
    host: 'localhost:3000',
    schemes: [http]
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/index.js'
];

//Generates swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);