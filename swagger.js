const fs = require('fs');
const path = require('path');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Pick-and-Play API',
    description: 'Pick-and-Play API',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/index.js'
];

const buildSplitDocs = (fullDoc) => {
  const paths = fullDoc.paths || {};
  const tagsToPaths = new Map();

  Object.entries(paths).forEach(([routePath, methods]) => {
    const normalizedMethods = methods || {};

    Object.entries(normalizedMethods).forEach(([method, operation]) => {
      const primaryTag = Array.isArray(operation?.tags) && operation.tags.length
        ? operation.tags[0]
        : 'Default';

      if (!tagsToPaths.has(primaryTag)) {
        tagsToPaths.set(primaryTag, {});
      }

      const tagPaths = tagsToPaths.get(primaryTag);
      if (!tagPaths[routePath]) {
        tagPaths[routePath] = {};
      }

      tagPaths[routePath][method] = operation;
    });
  });

  return tagsToPaths;
};

const writeSplitDocs = (fullDoc) => {
  const splitOutputDir = path.join(__dirname, 'swagger');
  fs.mkdirSync(splitOutputDir, { recursive: true });

  const splitDocs = buildSplitDocs(fullDoc);

  splitDocs.forEach((tagPaths, tagName) => {
    const splitDoc = {
      swagger: fullDoc.swagger,
      info: {
        ...(fullDoc.info || {}),
        title: `${fullDoc.info?.title || 'API'} - ${tagName}`
      },
      host: fullDoc.host,
      schemes: fullDoc.schemes,
      basePath: fullDoc.basePath,
      tags: [{ name: tagName }],
      paths: tagPaths
    };

    const fileName = `swagger-${tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    const filePath = path.join(splitOutputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(splitDoc, null, 2));
  });
};

// Generates swagger.json and also writes smaller per-tag docs into ./swagger
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  const fullDoc = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));
  writeSplitDocs(fullDoc);
});