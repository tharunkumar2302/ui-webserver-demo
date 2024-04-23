const express = require('express');
const { healthController } = require('../../controllers');

const router = express.Router();

router.get('/', healthController.checkServerStatus);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: To check Server is Up Or Not
 */
