const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { jobApplicantValidation } = require('../../validations');
const { jobApplicantController } = require('../../controllers');

const router = express.Router();

// Routes for Login candidate
router
  .route('/currentUser')
  .post(
    auth('manageJobApplicantForSelf'),
    validate(jobApplicantValidation.createApplicantForCandidate),
    jobApplicantController.createJobApplicantForCurrentUser
  )
  .get(
    auth('getJobApplicantForSelf'),
    validate(jobApplicantValidation.getJobApplicantForCandidate),
    jobApplicantController.getJobApplicantForCurrentUser
  )
  .patch(
    auth('manageJobApplicantForSelf'),
    validate(jobApplicantValidation.updateApplicantForCandidate),
    jobApplicantController.updateJobApplicantForCurrentUser
  );

// Routes for admin and recruiter
router
  .route('/')
  .post(
    auth('manageJobApplicant'),
    validate(jobApplicantValidation.createApplicant),
    jobApplicantController.createJobApplicant
  )
  .get(auth('getJobApplicant'), validate(jobApplicantValidation.getJobApplicant), jobApplicantController.getJobApplicant);

router
  .route('/:jobApplicantId')
  .get(
    auth('getJobApplicant'),
    validate(jobApplicantValidation.getJobApplicantById),
    jobApplicantController.getJobApplicantById
  )
  .patch(
    auth('manageJobApplicant'),
    validate(jobApplicantValidation.updateJobApplicantById),
    jobApplicantController.updateJobApplicantById
  )
  .delete(
    auth('manageJobApplicant'),
    validate(jobApplicantValidation.getJobApplicantById),
    jobApplicantController.deleteJobApplicantById
  );
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: JobApplicant
 *   description: Job Application management and retrieval
 */
