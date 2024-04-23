const httpStatus = require('http-status');
const { systemRolesService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addAuditFields = require('../utils/addAuditFields');

/**
 * @swagger
 * /systemRoles:
 *   post:
 *     summary: Create a system role
 *     description: Only admins can create other system roles.
 *     tags: [SystemRoles]
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
 *               name: fake firstName
 *               description: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SystemRoles'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createRole = catchAsync(async (req, res) => {
  const role = await systemRolesService.createRole(await addAuditFields(req, 'createAPi'));
  res.status(httpStatus.CREATED).send({ role });
});

/**
 * @swagger
 * /systemRoles:
 *   get:
 *     summary: Get all System Roles
 *     description: Only admins can retrieve all Roles.
 *     tags: [SystemRoles]
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
 *                     $ref: '#/components/schemas/SystemRoles'
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
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await systemRolesService.queryRoles(filter, options);
  res.send(result);
});

/**
 * @swagger
 * /systemRoles/{id}:
 *   get:
 *     summary: Get a System Role
 *     description: Only admins can fetch roles.
 *     tags: [SystemRoles]
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
 *                $ref: '#/components/schemas/SystemRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getRole = catchAsync(async (req, res) => {
  const user = await systemRolesService.getRoleById(req.params.roleId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  res.send(user);
});

/**
 * @swagger
 * /systemRoles/systemRoleByName/{name}:
 *   get:
 *     summary: Get a System Role
 *     description: Only admins can fetch roles.
 *     tags: [SystemRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Role name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SystemRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getRoleByName = catchAsync(async (req, res) => {
  const role = await systemRolesService.getRoleByName(req.params.name);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  res.send(role);
});

/**
 * @swagger
 * /systemRoles/{id}:
 *   patch:
 *     summary: Update a System role
 *     description: Only admins can update Role.
 *     tags: [SystemRoles]
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
 *                $ref: '#/components/schemas/SystemRoles'
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
  const role = await systemRolesService.updateRoleById(req.params.roleId, await addAuditFields(req, 'updateAPi'));
  res.send(role);
});

/**
 * @swagger
 * /systemRoles/{id}:
 *    delete:
 *     summary: Delete a System Role
 *     description: Only admins can delete system role.
 *     tags: [SystemRoles]
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
 *         description: No content
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
  await systemRolesService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRoleByName,
};
