const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// #swagger.ignore = true
router.use('/api-docs', swaggerUi.serve);

// #swagger.ignore = true
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;