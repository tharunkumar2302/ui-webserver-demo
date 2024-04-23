const httpStatus = require('http-status');
const { organizationService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addAuditFields = require('../utils/addAuditFields');

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a organization
 *     description: Only admins can create organizations.
 *     tags: [Organizations]
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
 *                $ref: '#/components/schemas/Organization'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.createOrganization(await addAuditFields(req, 'createAPi'));
  res.status(httpStatus.CREATED).send({ organization });
});

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Get all organizations
 *     description: Only admins can retrieve all organizations.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: organization name
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
 *         description: Maximum number of organizations
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
 *                     $ref: '#/components/schemas/Organization'
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

const getOrganizations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await organizationService.queryOrganizations(filter, options);
  res.send(result);
});

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get a organization
 *     description: Only admins can fetch organizations.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: organization id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Organization'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getOrganization = catchAsync(async (req, res) => {
  const user = await organizationService.getOrganizationById(req.params.organizationId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'organization not found');
  }
  res.send(user);
});

/**
 * @swagger
 * /organizations/organizationByName/{name}:
 *   get:
 *     summary: Get a organization
 *     description: Only admins can fetch organizations.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: organization name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Organization'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getOrganizationByName = catchAsync(async (req, res) => {
  const role = await organizationService.getOrganizationByName(req.params.name);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'organization not found');
  }
  res.send(role);
});

/**
 * @swagger
 * /organizations/{id}:
 *   patch:
 *     summary: Update a organization
 *     description: Only admins can update organization.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: organization id
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
 *                $ref: '#/components/schemas/Organization'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateOrganization = catchAsync(async (req, res) => {
  const organization = await organizationService.updateOrganizationById(
    req.params.organizationId,
    await addAuditFields(req, 'updateAPi')
  );
  res.send(organization);
});

/**
 * @swagger
 * /organizations/{id}:
 *    delete:
 *     summary: Delete a organization
 *     description: Only admin can delete organization.
 *     tags: [Organizations]
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

const deleteOrganization = catchAsync(async (req, res) => {
  await organizationService.deleteOrganizationById(req.params.organizationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationByName,
};
