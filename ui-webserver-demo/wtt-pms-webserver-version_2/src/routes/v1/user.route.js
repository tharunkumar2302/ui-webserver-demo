const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/currentUser')
  .get(auth(), userController.getCurrentUser)
  .patch(auth(), validate(userValidation.updateCurrentUser), userController.updateCurrentUser);

router
  .route('/recruiter')
  .post(auth('addRecruiter'), validate(userValidation.createRecruiter), userController.createRecruiter)
  .get(auth('getRecruiter'), validate(userValidation.getRecruiters), userController.getRecruiters)
  .patch(auth('addRecruiter'), validate(userValidation.updateRecruiters), userController.updateRecruiters);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
