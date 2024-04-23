const { query } = require('../config/logger');
const { User, SystemRole, pricingplan } = require('../models');
const { emailService, tokenService, organizationService } = require('../services');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /employerData:
 *   get:
 *     summary: Get all Employers
 *     description: Only Admin can retrieve all Employer details.
 *     tags: [Employer]
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
 *                     $ref: '#/components/schemas/user'
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


const getEmployersData = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default is 1
  const limit = parseInt(req.query.limit) || 10; // Number of documents per page, default is 10
  let keyword=req.query.keyword;
  let query = { createdByUserRole: req.user.role };
  const skip = (page - 1) * limit; // Number of documents to skip
  
  const count = await User.countDocuments(query);
  const totalPages = Math.ceil(count / limit); // Total number of pages

  const data = await User.find(query)
    .populate('pricingPlan')
    .populate('organization')
    .populate('createdByUserId')
    .skip(skip)
    .limit(limit);
  
  console.log(data[0].organization);
  const filteredData = keyword
    ? data.filter(user => user.organization.name.toLowerCase().includes(keyword.toLowerCase()))
    : data;
  res.send({
    results: filteredData,
      totalResults: count,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit

  });
});


/**
 * @swagger
 * /employerData/updateData:
 *   patch:
 *     summary: Update a Employer details
 *     description: Only Admin can update Employer details.
 *     tags: [Employer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - firstName
 *               - lastName
 *               - designation
 *               - role
 *               - mobileNumber
 *               - organizationName
 *               - emailAddress
 *               - status
 *               - pricingPlan
 *             properties:
 *               id:
 *                 type: objectId
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: objectId
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
 *             example:
 *               id: fake id
 *               firstName: fake name
 *               lastName: fake name
 *               emailAddress: fake@example.com
 *               mobileNumber: '9574637464'
 *               designation: fake
 *               organizationName: fake ORG
 *               role: fake role
 *               status: Draft
 *               pricingPlan: Beta
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/user'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


const updateEmployerData = catchAsync(async (req, res) => {
  let message;
  const plan = await pricingplan.findOne({ name: req.body.pricingPlan });
  req.body.pricingPlan = plan._id;
  if (req.body.status === 'Draft') {
    let data = await organizationService.populateOrganizationData(req.body);
    console.log(data);
    await User.updateOne({ _id: req.body.id }, { $set: data });
    message = 'Data updated Successfully';
  }
  else if (req.body.status === 'Invited') {
    let data = await organizationService.populateOrganizationData(req.body);
    await User.updateOne({ _id: req.body.id }, { $set: data });
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.body);
    await emailService.sendVerificationEmail(req.body.emailAddress, verifyEmailToken, req.body);
    message = "Email verification link has sent to an user."
    await User.updateOne({emailAddress: req.body.emailAddress},{$set: {status: "Invited"}})
  }
  else if (req.body.status === 'Re-invited') {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.body);
    await emailService.sendVerificationEmail(req.body.emailAddress, verifyEmailToken, req.body);
    message = "Email verification link has sent to an user."
    await User.updateOne({emailAddress: req.body.emailAddress},{$set: {status: "Re-invite"}})
  }
  else {
    message = 'You cannot update data after invite!!';
  }
  res.send({ message: message });
});
module.exports = { getEmployersData, updateEmployerData };
