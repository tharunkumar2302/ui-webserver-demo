const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/register-employer',auth(), validate(authValidation.registerEmployer), authController.registerEmployer);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/mforgot-password', validate(authValidation.forgotPassword), authController.mForgotPassword);
router.post('/mreset-password', validate(authValidation.mResetPassword), authController.mResetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.get('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/change-password',auth(), validate(authValidation.changePassword), authController.changePassword);
router.post('/deactivate-account',auth(), authController.deactivateAccount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */
