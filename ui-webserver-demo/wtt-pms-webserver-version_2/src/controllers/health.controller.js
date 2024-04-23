const config = require("../config/config");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");



/**
 * @swagger
 * /:
 *   get:
 *     summary: To check Server is Up Or Not and on which port server is running
 *     description: any one can access this route.
 *     tags: [Health]
 *     responses:
 *       "200":
 *         description: OK
 */
const checkServerStatus = catchAsync(async (req, res) => {
  res.send({ message: `server is up on port: ${config.port}` });
});

module.exports = {
  checkServerStatus,
}


