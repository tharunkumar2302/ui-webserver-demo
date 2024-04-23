const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { menuAccessValidation } = require('../../validations');
const { menuAccessController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageMenuAccess'), validate(menuAccessValidation.createMenuAccess), menuAccessController.createMenuAccess)
  .get(auth('getMenuAccess'), menuAccessController.getMenuAccess)
  .patch(auth('manageMenuAccess'), validate(menuAccessValidation.updateMenuAccess), menuAccessController.updateMenuAccess)
  .delete(auth('manageMenuAccess'), validate(menuAccessValidation.deleteMenuAccess), menuAccessController.deleteMenuAccess);

module.exports = router;
