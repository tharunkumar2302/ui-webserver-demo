const httpStatus = require('http-status');
const { systemRolesService, jobRoleService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addAuditFields = require('../utils/addAuditFields');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { JobRole } = require('../models');
const { log } = require('handlebars');

/**
 * @swagger
 * /jobRole:
 *   post:
 *     summary: Create a job role
 *     description: Only recruiter can create job roles.
 *     tags: [JobRole]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: fake role
 *               description: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobRole'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createRole = catchAsync(async (req, res) => {
  const role = await jobRoleService.createRole(await addAuditFields(req, 'createAPi'));
  res.status(httpStatus.CREATED).send({ role });
});

/**
 * @swagger
 * /jobRole:
 *   get:
 *     summary: Get all System Roles
 *     description: Only recruiter can retrieve all Roles.
 *     tags: [JobRole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: role name
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
 *                     $ref: '#/components/schemas/JobRole'
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

const getRoles = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(pick(req.query, ['name','isActive']), req.user);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobRoleService.queryRoles(filter,options);
  res.send(result);
});

/**
 * @swagger
 * /jobRole/{id}:
 *   get:
 *     summary: Get a Job Role
 *     description: Only recruiter can fetch roles.
 *     tags: [JobRole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getRole = catchAsync(async (req, res) => {
  const role = await jobRoleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job Role not found');
  }
  res.send(role);
});


/**
 * @swagger
 * /jobRole/{id}:
 *   patch:
 *     summary: Update a job role
 *     description: Only recruiter can update Role.
 *     tags: [JobRole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique
 *               description:
 *                 type: string
 *             example:
 *               name: fake role
 *               description: this role is about
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobRole'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateRole = catchAsync(async (req, res) => {
  const role = await jobRoleService.updateRoleById(req.params.roleId, await addAuditFields(req, 'updateAPi'));
  res.send(role);
});

/**
 * @swagger
 * /jobRole/{id}:
 *    delete:
 *     summary: Delete a Job Role
 *     description: Only recruiter can delete job role.
 *     tags: [JobRole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role id
 *     responses:
 *       "200":
 *         description: job Role deleted successfuly
 *       "302":
 *         description: can not delete this role
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const deleteRole = catchAsync(async (req, res) => {
  await jobRoleService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.OK).send({ message: 'job Role deleted successfuly'});
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
