const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
  organizationService,
  systemRolesService,
  resumeService,
} = require('../services');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const {
  SystemRole,
  Token,
  User,
  pricingplanusageorganisation,
  pricingplan,
  pricingPlanRules,
  Resumes,
  Organization,
} = require('../models');
const addAuditFields = require('../utils/addAuditFields');
const { changepassword, deleteAccount } = require('../services/auth.service');
const { parseTemplate, enQueueEmail } = require('../services/email.service');

/** REGISTOR
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - designation
 *               - role
 *               - mobileNumber
 *               - organizationName
 *               - emailAddress
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               designation:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               organizationName:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: fake name
 *               lastName: fake name
 *               emailAddress: fake@example.com
 *               mobileNumber: '9574637464'
 *               designation: fake
 *               organizationName: fake ORG
 *               role: user
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

const register = catchAsync(async (req, res) => {
  const role = await SystemRole.findOne({ name: req.body.role ?? 'employer' });
  let isInviteToken = null;
  if (req.body.inviteToken) {
    isInviteToken = await tokenService.getCandidateResumeDetails(req.body.inviteToken);
    if (isInviteToken) {
      req.body.isEmailVerified = true;
      req.body.resume = isInviteToken._id || isInviteToken.id;
    }
  }
  const data = await organizationService.populateOrganizationData(req.body);
  const createUserData = await systemRolesService.populateSystemRoleData(data);
  const pricingPlanName = await pricingplan.findOne({ name: req.body.pricingPlan });
  if (role.name === 'employer') {
    createUserData.pricingPlan = pricingPlanName._id || pricingPlanName.id;
    await addAuditFields(req, 'createAPi');
  }
  let user = await userService.createUser(createUserData);
  req.user = {
    ...JSON.parse(JSON.stringify(user)),
    role: user.role._id || user.role.id,
    organization: user.organization._id || user.organization.id,
  };
  if (role.name === 'candidate' && !isInviteToken) {
    const resumeData = await addAuditFields(req, 'createAPi');
    req.body = {
      ...req.body,
      phone_no: user.mobileNumber,
      email: user.emailAddress,
      status: 'Published',
      current_location: 'NA',
      candidateregistered: true,
    };
    const resumeCreate = await resumeService.createResume({ ...resumeData, ...req.body });
    user = await userService.updateUserById(user.id || user._id, {
      ...JSON.parse(JSON.stringify(user)),
      role: user.role.id || user.role._id,
      organization: user.organization.id || user.organization._id,
      resume: resumeCreate.id || resumeCreate._id,
    });
  }

  if (!isInviteToken) {
    sendVerificationEmail({ user }, res);
  } else {
    const token = await Token.findOne({ token: req.body.inviteToken });
    if (token) {
      const resume = await Resumes.findOne({ _id: token.user });
      const recruiter = await User.findById(resume.createdByUserId);
      emailService.sendCandidateAcceptenceEmail(
        recruiter.emailAddress,
        `${user.firstName} ${user.lastName}`,
        `${recruiter.firstName} ${recruiter.lastName}`
      );
    }
  }
  res.status(httpStatus.CREATED).send({ user });
});

/** EMPLOYERREGISTOR
 * @swagger
 * /auth/register-employer:
 *   post:
 *     summary: Register an employer
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - designation
 *               - role
 *               - mobileNumber
 *               - organizationName
 *               - emailAddress
 *               - password
 *               - status
 *               - pricingPlan
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               designation:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               organizationName:
 *                 type: string
 *               status:
 *                 type: string
 *               pricingPlan:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               firstName: fake name
 *               lastName: fake name
 *               emailAddress: fake@example.com
 *               mobileNumber: '9574637464'
 *               designation: fake
 *               organizationName: fake ORG
 *               role: user
 *               password: password1
 *               status: Draft
 *               pricingPlan: Beta
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

const registerEmployer = catchAsync(async (req, res) => {
  let message;
  let data = await addAuditFields(req, 'createAPi', true);
  data = await organizationService.populateOrganizationData(data);
  data.designation = req.body.designation;
  const createUserData = await systemRolesService.populateSystemRoleData({ ...data, role: 'employer' });
  const pricingPlanName = await pricingplan.findOne({ name: req.body.pricingPlan });
  const userData = {
    ...createUserData,
    password: `${config.ui.defaultEmployerPass}`,
    pricingPlan: pricingPlanName._id || pricingPlanName.id,
    status: req.body.status,
  };
  const user = await userService.createEmployer(userData);
  if (user) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    if (req.body.status === 'Invited') {
      await emailService.sendVerificationEmail(user.emailAddress, verifyEmailToken, user);
      message = 'Email verification link has sent to an user.';
    } else {
      message = 'User save as Draft';
    }
  }
  res.status(httpStatus.CREATED).send({ user, message: message });
});

/** LOGIN
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -  emailAddress
 *               -  password
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               emailAddress: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */
const login = catchAsync(async (req, res) => {
  const { emailAddress, password } = req.body;
  const email = emailAddress;
  resumeService.updateResumeView();
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (req.query.isMobile && user.role.name !== 'candidate') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please login with candidate account');
  }
  const tokens = await tokenService.generateAuthTokens(user);
  changePassword(tokens);
  res.send({ user, tokens });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/** Refresh-Token
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

/** Forget-password
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               targetUrl:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               targetUrl: "http://www.example.com/"
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, user, req.body.targetUrl);
  res.send({ message: 'Check your mail to reset the password' });
});

/** Forget-password for mobile
 * @swagger
 * /auth/mforgot-password:
 *   post:
 *     summary: Forgot password for mobile
 *     description: An email having passcode will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               resetPasswordPassCode:
 *                 type: string
 *               targetUrl:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               passcode: 123456
 *               targetUrl: "http://www.example.com/"
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const mForgotPassword = catchAsync(async (req, res) => {
  const user1 = await userService.getUserByEmail(req.body.email);
  const resetPasswordPassCode = await tokenService.generateResetPasswordPasscode(req.body.email);
  await emailService.sendEmailPassCode(
    req.body.email,
    resetPasswordPassCode.resetPasswordPassCode,
    user1,
    req.body.targetUrl
  );
  const token = resetPasswordPassCode.resetPasswordToken;
  res.send({ message: 'Check your mail indox', token });
});

/** Reset-password for mobile
 * @swagger
 * /auth/mreset-password:
 *   post:
 *     summary: Reset password for mobile
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *       - in: query
 *         name: passcode
 *         schema:
 *           type: string
 *         description: The reset password passcode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

const mResetPassword = catchAsync(async (req, res) => {
  await authService.mResetPassword(req.query.token, req.query.passcode, req.body.password);
  res.send({ message: 'Password changed successfully' });
});

/** Reset-password
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.send({ message: 'Password changed successfully' });
});

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.emailAddress, verifyEmailToken, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
const verifyEmail = catchAsync(async (req, res) => {
  const userid = await Token.findOne({ token: `${req.query.token}` });
  const code = await authService.verifyEmail(req.query.token);
  if (code.isEmailVerified === true && code.role.name === 'employer') {
    const pricingPlanData = await pricingplan.findById(code.pricingPlan);
    const pricingPlanUsageOrganizationData = await pricingplanusageorganisation.findOne({
      name: pricingPlanData.name,
      organization: code.organization._id,
    });
    const pricingPlanRule = await pricingPlanRules.find({ plan: pricingPlanData.name });
    if (pricingPlanUsageOrganizationData == null) {
      const dataInsert = new pricingplanusageorganisation({
        rules: pricingPlanRule,
        name: pricingPlanData.name,
        description: pricingPlanData.name + ' subscription',
        unique_Code: pricingPlanData.name === 'Beta' ? 'beta' : pricingPlanData.name == 'Trial' ? 'Trial' : '',
        organization: code.organization._id || code.organization._id,
        user: code._id || code.id,
      });
      await dataInsert.save();
    }
  }
  if (code === httpStatus.UNAUTHORIZED) {
    res.redirect(config.ui.devUrl + config.ui.verifyEmailError);
    // throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  } else {
    const userdata = await User.findById({ _id: userid.user });
    const userrole = await SystemRole.findById({ _id: userdata.role });

    // console.log(userid,'userid');
    // console.log(userrole,'verify email');
    // console.log(userdata,'userdata');
    if (userid && userrole?.name != 'recruiter' && userrole?.name != 'employer') {
      // console.log(userrole);
      return res.redirect(config.ui.devUrl + config.ui.verifyEmailSuccessfull);
    } else {
      console.log('Recruiter Account Created');
      const subject = userrole.name === 'employer' ? 'Employer Account Created' : 'Recruiter Account Created';
      // replace this url with the link to the email verification page of your front-end app
      const loginUrl = `${config.ui.devUrl + config.ui.login}`;
      const body = await parseTemplate(loginUrl, 'recruiter/recruiter', userdata, {
        firstLine:
          userrole.name === 'employer'
            ? 'Your Employer account has been created.'
            : 'Your Recruiter account has been created.',
        password: userrole.name === 'employer' ? `${config.ui.defaultEmployerPass}` : `${config.ui.defaultUserPass}`,
        email: userdata.emailAddress,
        subject,
      });
      await enQueueEmail(userdata.emailAddress, subject, body);
      // await emailService.sendEmail(userdata.emailAddress, subject, loginUrl, 'recruiter/recruiter', userdata, {
      //   password: `${config.ui.defaultUserPass}`,
      //   email: userdata.emailAddress,
      //   subject,
      // });
    }
    return res.redirect(config.ui.devUrl + config.ui.verifyRecruiterEmailSuccessfull);
    // res.status(httpStatus.OK).send({ message: 'Email Verified successfully.' });
  }
});
/** Change-password
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldpassword
 *               - newpassword
 *             properties:
 *               oldpassword:
 *                 type: string
 *                 format: oldpassword
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               newpassword:
 *                 type: string
 *                 format: newpassword
 *                 minLength: 8
 *                 description: At least one number and one letter
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password change failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password change failed
 */

const changePassword = catchAsync(async (req, res) => {
  const result = await changepassword(req.user, req.body.oldpassword, req.body.newpassword);
  res.status(httpStatus.OK).send(result);
});

const deactivateAccount = catchAsync(async (req, res) => {
  const result = await deleteAccount(req.user);
  res.send(result);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  mForgotPassword,
  mResetPassword,
  changePassword,
  deactivateAccount,
  registerEmployer,
};
