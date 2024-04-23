const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const interviewSetupController = require('../../controllers/interviewSchedule.controller');
const interviewSetupValidation = require('../../validations/interviewSchedule.validation');

const router = express.Router();

router
  .route('/createInterviewMeeting')
  .post(
    auth('manageInterviewSchedule'),
    validate(interviewSetupValidation.createScheduleForInterview),
    interviewSetupController.createScheduleForInterview
  );

router.route('/callback').get(interviewSetupController.createSchedule);

router
  .route('/updateInterviewResults')
  .patch(validate(interviewSetupValidation.updateResultPdf), interviewSetupController.updateResultPdf);

router
  .route('/scheduleInterviews')
  .get(auth('getInterviewSchedule'),validate(interviewSetupValidation.getAllScheduleInterviews), interviewSetupController.getAllScheduleInterviews);

router
  .route('/cancelInterview')
  .delete(auth('manageInterviewSchedule'), validate(interviewSetupValidation.deleteScheduleInterview), interviewSetupController.deleteInterviewById);

router
  .route('/profileSearch')
  .get(auth('getInterviewSchedule'), validate(interviewSetupValidation.getSearchedProfiles), interviewSetupController.getSearchedProfiles);

router
  .route('/:interviewId')
  .get(auth('getInterviewSchedule'), validate(interviewSetupValidation.getInterviewData), interviewSetupController.getInterviewData);

module.exports = router;
