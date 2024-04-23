const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { systemRolesValidation } = require('../../validations');
const { systemRolesController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSystemRoles'), validate(systemRolesValidation.createRole), systemRolesController.createRole)
  .get(auth('getSystemRoles'), validate(systemRolesValidation.getRoles), systemRolesController.getRoles);

router
  .route('/:roleId')
  .get(auth('getSystemRoles'), validate(systemRolesValidation.getRole), systemRolesController.getRole)
  .patch(auth('manageSystemRoles'), validate(systemRolesValidation.updateRole), systemRolesController.updateRole)
  .delete(auth('manageSystemRoles'), validate(systemRolesValidation.deleteRole), systemRolesController.deleteRole);
router
  .route('/systemRoleByName/:name')
  .get(auth('getSystemRoles'), validate(systemRolesValidation.getRoleByName), systemRolesController.getRoleByName);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SystemRoles
 *   description: User management and retrieval
 */
