const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { organizationValidation } = require('../../validations');
const { organizationController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageOrganization'),
    validate(organizationValidation.createOrganization),
    organizationController.createOrganization
  )
  .get(auth('getOrganization'), validate(organizationValidation.getOrganizations), organizationController.getOrganizations);

router
  .route('/:organizationId')
  .get(auth('getOrganization'), validate(organizationValidation.getOrganization), organizationController.getOrganization)
  .patch(
    auth('manageOrganization'),
    validate(organizationValidation.updateOrganization),
    organizationController.updateOrganization
  )
  .delete(
    auth('manageOrganization'),
    validate(organizationValidation.deleteOrganization),
    organizationController.deleteOrganization
  );
router
  .route('/organizationByName/:name')
  .get(
    auth('getOrganization'),
    validate(organizationValidation.getOrganizationByName),
    organizationController.getOrganizationByName
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organizations management and retrieval
 */
