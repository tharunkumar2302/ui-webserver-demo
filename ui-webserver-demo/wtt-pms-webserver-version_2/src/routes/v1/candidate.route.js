const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { candidateController } = require('../../controllers/index');
const { candidateValidation } = require('../../validations/index');

const router = express.Router();

router
  .route('/invite')
  .post(
    auth('manageInviteCandidate'),
    validate(candidateValidation.createinviteForCandidate),
    candidateController.createinviteForCandidate
  );

router.route('/details').get(validate(candidateValidation.getinviteForCandidate), candidateController.getinviteForCandidate);

router.route('/KPI').get(auth('candidateKPI'), candidateController.getCandidateView);

module.exports = router;
