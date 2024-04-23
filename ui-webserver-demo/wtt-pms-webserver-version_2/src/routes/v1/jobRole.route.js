const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { jobRoleValidation } = require('../../validations');
const { jobRoleController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('ManageJobRole'), validate(jobRoleValidation.createRole), jobRoleController.createRole)
  .get(auth(), validate(jobRoleValidation.getRoles), jobRoleController.getRoles);

router
  .route('/:roleId')
  .get(auth('getJobRole'), validate(jobRoleValidation.getRole), jobRoleController.getRole)
  .patch(auth('ManageJobRole'), validate(jobRoleValidation.updateRole), jobRoleController.updateRole)
  .delete(auth('ManageJobRole'), validate(jobRoleValidation.deleteRole), jobRoleController.deleteRole);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: JobRole
 *   description: Job Role management and retrieval
 */
