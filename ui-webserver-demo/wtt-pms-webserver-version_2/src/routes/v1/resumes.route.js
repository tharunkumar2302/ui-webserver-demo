const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const resumeValidation = require('../../validations/resumes.validation');
const resumeController = require('../../controllers/resumes.controller');

const router = express.Router();

router
  .route('/downloadresume/:_id')
  .get(auth('manageResume'), validate(resumeValidation.downloadResume), resumeController.downloadResume);

router.get('/kpi', auth(), resumeController.getResumeView);

router
  .route('/currentuser')
  .post(auth(), validate(resumeValidation.createResume), resumeController.createResumeForCurrentUser)
  .patch(auth(), validate(resumeValidation.updateResumeForCurrentUser), resumeController.updateResumeForCurrentUser)
  .get(auth(), resumeController.getResumeForCurrentUser);

router.route('/profileupload').post(auth('uploadProfile'), resumeController.profileUpload);
router.route('/importTemplate').get(auth(), resumeController.getImortTemplate);
router.route('/import').post(auth(), resumeController.importResumes);
router.route('/resumedownload').get(auth(),resumeController.resumeDownload);
router.route('/export').post(auth('manageResume'), validate(resumeValidation.exportResumes), resumeController.exportResumes);
router
  .route('/')
  .post(auth('getResume'), validate(resumeValidation.createResume), resumeController.createResume)
  .get(auth('manageResume'), validate(resumeValidation.getallResumes), resumeController.getallResumes);

router
  .route('/searchFilter')
  .get(auth('getResume'), validate(resumeValidation.getResumesbyKeyword), resumeController.getResumesbyKeyword)
  .post(auth('manageResume'), validate(resumeValidation.getFilteredSearchData), resumeController.getFilteredSearchData);
router
  .route('/:_id')
  .get(auth('getResume'), validate(resumeValidation.getResume), resumeController.getResume)
  .patch(auth('getResume'), validate(resumeValidation.updateResume), resumeController.updateResume)
  .delete(auth('manageResume'), validate(resumeValidation.deleteResume), resumeController.deleteResume);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resumes management and retrieval
 */
