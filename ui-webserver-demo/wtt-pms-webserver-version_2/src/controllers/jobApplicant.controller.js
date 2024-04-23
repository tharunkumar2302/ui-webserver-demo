const httpStatus = require('http-status');
const { jobApplicantService, jobOpeningService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addAuditFields = require('../utils/addAuditFields');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');

/**
 * @swagger
 * /jobApplicant/currentUser:
 *   post:
 *     summary: Create a new job applicant
 *     description: Only candidate can create there job applicant.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobApplication
 *             properties:
 *               jobApplication:
 *                 type: string
 *               comments:
 *                 type:string
 *             example:
 *               jobApplication: 63f705786ea24e4ffcdae853
 *               comments: applied for the angular developer
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobApplicant'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createJobApplicantForCurrentUser = catchAsync(async (req, res) => {
  const jobApplicant = await jobApplicantService.createjobApplicant(req.user.id || req.user._id, {
    ...(await addAuditFields(req, 'createAPi')),
    status: 'applied',
  });
 jobApplicantService.notfyRecruiter(jobApplicant, jobOpeningService);
  res.status(httpStatus.CREATED).send({ jobApplicant });
});
/**
 * @swagger
 * /jobApplicant:
 *   post:
 *     summary: Create a new job applicant
 *     description: Only admin and recruiter can create new job applicant.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobApplication
 *               - user
 *             properties:
 *               jobApplication:
 *                 type: string
 *               user:
 *                 type: string
 *               comments:
 *                 type:string
 *             example:
 *               jobApplication: 63f705786ea24e4ffcdae853
 *               comments: applied for the angular developer
 *               user: 63f705786ea24e4ffcdae853
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobApplicant'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createJobApplicant = catchAsync(async (req, res) => {
  const jobApplicant = await jobApplicantService.createjobApplicant(req.user.id || req.user._id, {
    ...(await addAuditFields(req, 'createAPi')),
    status: 'applied',
  });
  res.status(httpStatus.CREATED).send({ jobApplicant });
});

/**
 * @swagger
 * /jobApplicant/{jobApplicantId}:
 *   patch:
 *     summary: get job application by id.
 *     description: Only admin and recruiter can access this route.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobApplicantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Applicant Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               comments:
 *                 type:string
 *             example:
 *               comments: applied for the angular developer
 *               status: applied
 *     responses:
 *       "201":
 *         description: updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobApplicant'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const updateJobApplicantById = catchAsync(async (req, res) => {
  const jobApplicant = await jobApplicantService.updatejobApplicant( req.params.jobApplicantId,{
    ...(await addAuditFields(req, 'updateAPI')),
  });

  res.status(httpStatus.CREATED).send({ jobApplicant });
});
/**
 * @swagger
 * /jobApplicant/currentUser:
 *   patch:
 *     summary: update a job applicant data
 *     description: Only candidate can update there job applicant.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobApplication
 *             properties:
 *               jobApplication:
 *                 type: string
 *               status:
 *                 type: string
 *               comments:
 *                 type:string
 *             example:
 *               jobApplication: 63f705786ea24e4ffcdae853
 *               comments: applied for the angular developer
 *               status: applied
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobApplicant'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const updateJobApplicantForCurrentUser = catchAsync(async (req, res) => {
  const jobApplicant = await jobApplicantService.createjobApplicant(req.user.id || req.user._id, {
    ...(await addAuditFields(req, 'updateAPI')),
  });
  jobApplicantService.notfyRecruiter(jobApplicant, jobOpeningService);
  res.status(httpStatus.CREATED).send({ jobApplicant });
});

/**
 * @swagger
 * /jobApplicant/currentUser:
 *   get:
 *     summary: get job applications of the current user.
 *     description: Only candidate can access this route.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobApplication
 *         schema:
 *           type: string
 *         description: job Opening ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: job Application status
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
 *                     $ref: '#/components/schemas/JobApplicant'
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
const getJobApplicantForCurrentUser = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(pick(req.query, ['user', 'jobApplication', 'status', 'comment']));
  filter.user = req.user.id || req.user._id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobApplicantService.queryJobApplicants(filter, options);

  res.send(result);
});
/**
 * @swagger
 * /jobApplicant:
 *   get:
 *     summary: get job applications.
 *     description: Only admin and recruiter can access this route.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobApplication
 *         schema:
 *           type: string
 *         description: job Opening ID
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: job Application status
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
 *                     $ref: '#/components/schemas/JobApplicant'
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
const getJobApplicant = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(pick(req.query, ['user', 'jobApplication', 'status', 'comment']), req.user);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobApplicantService.queryJobApplicants(filter, options);

  res.send(result);
});

/**
 * @swagger
 * /jobApplicant/{jobApplicantId}:
 *   get:
 *     summary: get job application by id.
 *     description: Only admin and recruiter can access this route.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobApplicantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Applicant Id
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
 *                     $ref: '#/components/schemas/JobApplicant'
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
const getJobApplicantById = catchAsync(async (req, res) => {
  const jobApplicant = await jobApplicantService.getJobApplicantById(req.params.jobApplicantId);
  if (!jobApplicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'jobApplicant not found');
  }
  res.send(jobApplicant);
});
/**
 * @swagger
 * /jobApplicant/{jobApplicantId}:
 *   delete:
 *     summary: delete job application by id.
 *     description: Only admin and recruiter can access this route.
 *     tags: [JobApplicant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobApplicantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Applicant Id
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
 *                     $ref: '#/components/schemas/JobApplicant'
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
const deleteJobApplicantById = catchAsync(async (req, res) => {
  await jobApplicantService.deleteJobApplicantById(req.params.jobApplicantId);
  res.status(httpStatus.OK).send({ message: 'job application deleted successfuly' });
});

module.exports = {
  createJobApplicantForCurrentUser,
  createJobApplicant,
  getJobApplicantForCurrentUser,
  updateJobApplicantForCurrentUser,
  getJobApplicantById,
  getJobApplicant,
  updateJobApplicantById,
  deleteJobApplicantById,
};
