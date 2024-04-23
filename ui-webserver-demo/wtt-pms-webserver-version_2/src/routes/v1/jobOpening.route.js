const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { jobOpeningValidation } = require('../../validations');
const { jobOpeningController } = require('../../controllers');

const router = express.Router();
router
  .route('/relevantjobs')
  .get(auth('GetReleventJobs'), validate(jobOpeningValidation.getJobOpenings), jobOpeningController.getRelevantJobs);

  router
    .route('/filter')
    .get(
      auth('GetFilterJobOpening'),
      validate(jobOpeningValidation.advanceSearchFilter),
      jobOpeningController.advanceSearchFilter
    );
router.route('/jobs/:jobOpeningId').get(validate(jobOpeningValidation.getJobOpening), jobOpeningController.getJobOpening);

router
  .route('/')
  .post(auth('ManageJobOpening'), validate(jobOpeningValidation.createJobOpening), jobOpeningController.createJobOpening)
  .get(auth('GetJobOpening'), validate(jobOpeningValidation.getJobOpenings), jobOpeningController.getJobOpenings);

  
router
  .route('/:jobOpeningId')
  .get(auth('GetJobOpening'), validate(jobOpeningValidation.getJobOpening), jobOpeningController.getJobOpening)
  .patch(auth('ManageJobOpening'), validate(jobOpeningValidation.updateJobOpening), jobOpeningController.updateJobOpening)
  .delete(auth('ManageJobOpening'), validate(jobOpeningValidation.deleteJobOpening), jobOpeningController.deleteJobOpening);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: JobOpening
 *   description: Job Opening management and retrieval
 */
