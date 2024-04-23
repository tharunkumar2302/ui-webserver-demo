const httpStatus = require('http-status');
const { menuAccessService, systemRolesService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const addAuditFields = require('../utils/addAuditFields');
const { MenuAccess, SystemRole } = require('../models');

/**
 * @swagger
 * /menuAccess:
 *   post:
 *     summary: Create a menu access.
 *     description: Only admin can create menu access.
 *     tags: [MenuAccess]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *               screen:
 *                 type: array
 *               isActive:
 *                 type: boolean
 *             example:
 *               role: fake employer
 *               screen: ["Dashboard", "Recruiter"]
 *               isActive: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/menuAccess'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

const createMenuAccess = catchAsync(async (req, res) => {
  const data = await addAuditFields(req, 'createAPi');
  const createMenuAccessData = await systemRolesService.populateSystemRoleData(data);
  const menuAcceser = await menuAccessService.createMenuAccess(createMenuAccessData);
  res.status(httpStatus.CREATED).send(menuAcceser);
});

/**
 * @swagger
 * /menuAccess:
 *   get:
 *     summary: Get all menu access
 *     description: recruiter, candidate ,admin & employer can retrieve all menu access.
 *     tags: [MenuAccess]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/menuAccess'
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

const getMenuAccess = catchAsync(async (req, res) => {
  const roleItem = await SystemRole.findById(req.user.role);
  let result = {};
    result = await MenuAccess.find({ role: roleItem.id }).populate('role');


  result = Array.from(new Set(result.map((data) => data.screen).flat()));


  res.send(result);
});

/**
 * @swagger
 * /menuAccess:
 *   patch:
 *     summary: Update a menu access array.
 *     description: Only admin can update menu access array.
 *     tags: [MenuAccess]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               screen:
 *                 type: array
 *               isActive:
 *                 type: boolean
 *             example:
 *               role: fake employer
 *               screen: ["Dashboard", "Recruiter","check"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/menuAccess'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateMenuAccess = catchAsync(async (req, res) => {
  const updateScreen = await menuAccessService.updateMenuAccessById(req.body.role, await addAuditFields(req, 'updateAPi'));
  res.send(updateScreen);
});

/**
 * @swagger
 * /menuAccess:
 *    delete:
 *     summary: Delete a menu Access
 *     description: Only admin can delete menu Access.
 *     tags: [MenuAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuAccessId
 *         required: true
 *         schema:
 *           type: string
 *         description: menu Access Id
 *     responses:
 *       "200":
 *         description: menu Access deleted successfully
 *       "302":
 *         description: can not delete this menu Access
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const deleteMenuAccess = catchAsync(async (req, res) => {
  await menuAccessService.deleteMenuAccessById(req.body.role);
  res.status(httpStatus.OK).send({ message: 'job Role deleted successfuly' });
});

module.exports = { createMenuAccess, getMenuAccess, updateMenuAccess, deleteMenuAccess };
