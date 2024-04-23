const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { employerDataController } = require('../../controllers');
const { employerDataValidation } = require('../../validations');

const router = express.Router();


router.route('/').get(auth('manageEmployer'),employerDataController.getEmployersData);
router.route('/updateData').patch(auth('manageEmployer'),validate(employerDataValidation.updateEmployerData),employerDataController.updateEmployerData);

module.exports = router;