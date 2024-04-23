const express = require('express');
const validate = require('../../middlewares/validate');
const pricingPlanValidation = require('../../validations/pricingplan.validation');
const pricingPlanController = require('../../controllers/pricingPlan.controller');
const auth = require('../../middlewares/auth');


const router = express.Router();

router.get('/', auth(), pricingPlanController.getPricingPlanData);

router.get('/plans',pricingPlanController.getPricingPlans)

module.exports = router;