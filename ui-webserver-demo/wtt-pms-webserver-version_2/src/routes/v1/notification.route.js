const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { notificationValidation } = require('../../validations/index');
const { notificationController } = require('../../controllers/index');

const router = express.Router();

router
  .route('/')
  .post(
    auth('ManageNotification'),
    validate(notificationValidation.createnotification),
    notificationController.createnotification
  );

module.exports = router;
