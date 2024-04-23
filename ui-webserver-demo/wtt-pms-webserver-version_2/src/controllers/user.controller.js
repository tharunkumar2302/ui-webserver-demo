const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, organizationService, systemRolesService, emailService, tokenService } = require('../services');
const addAuditFields = require('../utils/addAuditFields');
const { SystemRole, User } = require('../models');
const config = require('../config/config');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Users]
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
 *               - password
 *               - emailAddress
 *               - mobileNumber
 *               - designation
 *               - organizationName
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
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
 *               role:
 *                  type: string
 *                  enum: [user, admin,employer,candidate,recruiter]
 *               designation:
 *                  type:string
 *               mobileNumber:
 *                  type:string
 *               organizationName:
 *                  type:string
 *             example:
 *               firstName: fake firstName
 *               lastName: fake lastName
 *               emailAddress: fake@example.com
 *               password: password1
 *               mobileNumber: fake mmobileNumber
 *               designation: fake designation
 *               organizationName: fakse organizationName
 *               role: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createUser = catchAsync(async (req, res) => {
  const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'createAPi'));
  const createUserData = await systemRolesService.populateSystemRoleData(data);

  const user = await userService.createUser(createUserData);

  res.status(httpStatus.CREATED).send(user);
});
/**
 * @swagger
 * /users/recruiter:
 *   post:
 *     summary: Create a recruiter
 *     description: Only employer can create recruiters.
 *     tags: [Recruiter]
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
 *               - emailAddress
 *               - mobileNumber
 *               - designation
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               designation:
 *                  type:string
 *               mobileNumber:
 *                  type:string
 *             example:
 *               firstName: fake firstName
 *               lastName: fake lastName
 *               emailAddress: fake@example.com
 *               mobileNumber: fake mmobileNumber
 *               designation: fake designation
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createRecruiter = catchAsync(async (req, res) => {
  let data = await addAuditFields(req, 'createAPi');
  if (data.organizationName) {
    data = await organizationService.populateOrganizationData(data);
  }
  data.designation = 'n/a';
  const createUserData = await systemRolesService.populateSystemRoleData({ ...data, role: 'recruiter' });
  const userData = { ...createUserData, password: `${config.ui.defaultUserPass}` };
  const user = await userService.createRecruiter(userData);
  const recruiterCreateUser = await User.findById(user.createdByUserId);
  user.pricingPlan = recruiterCreateUser.pricingPlan;
  user.save();
  if (user) {
    //await emailService.sendLoginEmail(user, userData.password);
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.emailAddress, verifyEmailToken, user);
  }
  res.status(httpStatus.CREATED).send({ user, message: 'Email verification link has sent to an user.' });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Only admins can retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: First name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Last name
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *         description: Designation
 *       - in: query
 *         name: mobileNumber
 *         schema:
 *           type: string
 *         description: Mobile Number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(
    pick(req.query, ['firstName', 'lastName', 'designation', 'mobileNumber', 'role']),
    req.user
  );
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});
/**
 * @swagger
 * /users/recruiter:
 *   get:
 *     summary: Get all Recruiters
 *     description: Only admins can retrieve all Recruiters.
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: First name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Last name
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *         description: Designation
 *       - in: query
 *         name: mobileNumber
 *         schema:
 *           type: string
 *         description: Mobile Number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getRecruiters = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(
    pick(req.query, ['firstName', 'lastName', 'designation', 'mobileNumber']),
    req.user
  );
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  filter.role = await SystemRole.findOne({ name: 'recruiter' });
  if (filter.role) {
    filter.role = filter.role._id || filter.role.id;
  }
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req.user && req.user.organization);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
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
 *               role:
 *                  type: string
 *                  enum: [user, admin,employer,candidate,recruiter]
 *               designation:
 *                  type:string
 *               mobileNumber:
 *                  type:string
 *             example:
 *               firstName: fake firstName
 *               lastName: fake lastName
 *               designation: fake designation
 *               mobileNumber: fake mobileNumber
 *               emailAddress: fake@example.com
 *               password: password1
 *               role: fake role
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateUser = catchAsync(async (req, res) => {
  const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'createAPi'));
  const createUserData = data.role ? await systemRolesService.populateSystemRoleData({ ...data }) : data;

  const user = await userService.updateUserById(req.params.userId, createUserData);
  res.send(user);
});

/**
 * @swagger
 * /users/recruiter:
 *   patch:
 *     summary: Update a Recruiter
 *     description: Only Employer can update other Recruiter.
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
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
 *               role:
 *                  type: string
 *                  enum: [user, admin,employer,candidate,recruiter]
 *               designation:
 *                  type:string
 *               mobileNumber:
 *                  type:string
 *             example:
 *               id: "5ebac534954b54139806c112"
 *               firstName: fake firstName
 *               lastName: fake lastName
 *               designation: fake designation
 *               mobileNumber: fake mobileNumber
 *               emailAddress: fake@example.com
 *               password: password1
 *               role: fake role
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateRecruiters = catchAsync(async (req, res) => {
  const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'createAPi'));
  const createUserData = data.role ? await systemRolesService.populateSystemRoleData({ ...data }) : data;

  const user = await userService.updateUserById(req.body.id, createUserData, 'recruiters');
  res.send(user);
});

/**
 * @swagger
 * /users/currentUser:
 *   patch:
 *     summary: Update a CurrentUser
 *     description: Logged in users can only update their own information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
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
 *               role:
 *                  type: string
 *                  enum: [user, admin,employer,candidate,recruiter]
 *               designation:
 *                  type:string
 *               mobileNumber:
 *                  type:string
 *             example:
 *               firstName: fake firstName
 *               lastName: fake lastName
 *               designation: fake designation
 *               mobileNumber: fake mobileNumber
 *               emailAddress: fake@example.com
 *               password: password1
 *               role: fake role
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateCurrentUser = catchAsync(async (req, res) => {
  const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'createAPi'));
  const createUserData = data.role ? await systemRolesService.populateSystemRoleData({ ...data }) : data;

  const user = await userService.updateUserById(req.user.id || req.user._id, createUserData);
  res.send(user);
});

/**
 * @swagger
 * /users/{id}:
 *    delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @swagger
 * /users/currentUser:
 *   get:
 *     summary: get currentUser info.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Please authenticate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Please authenticate
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id || req.user.id);
  res.status(httpStatus.OK).send({ user });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createRecruiter,
  getRecruiters,
  getCurrentUser,
  updateCurrentUser,
  updateRecruiters,
};
