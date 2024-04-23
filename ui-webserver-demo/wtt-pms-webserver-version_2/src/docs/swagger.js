// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerAutogen = require('swagger-autogen')();
// const swaggerJSDoc = require('swagger-jsdoc');
const { version } = require('../../package.json');
const config = require('../config/config');

const doc = {
  openapi: '3.0.0',
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
    },
  ],
  info: {
    title: 'wtt-pms-webserver',
    version,
  },
};

const outputFile = 'src/docs/swagger-output.json';
const endpointsFiles = ['src/models/*.js', 'src/routes/v1/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {});
