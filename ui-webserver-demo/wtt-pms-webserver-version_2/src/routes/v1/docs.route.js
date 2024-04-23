const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDef = require('../../docs/swaggerDef');

const router = express.Router();

const endpointsFiles = ['src/docs/*.yml', 'src/models/*.js', 'src/routes/v1/*.js', 'src/controllers/*.js'];

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDef,
  apis: endpointsFiles,
});
router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  })
);

module.exports = router;
