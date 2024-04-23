const httpStatus = require('http-status');
const { jobOpeningService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addAuditFields = require('../utils/addAuditFields');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { JobOpening } = require('../models');

/**
 * @swagger
 * /jobOpening:
 *   post:
 *     summary: Create a job Opening
 *     description: Only recruiter can create job Opening.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillsRequired
 *               - description
 *               - qualification
 *               - location
 *               - minExperience
 *               - maxExperience
 *               - employmentType
 *               - status
 *               - workMode
 *               - jobRole
 *               - tags
 *             properties:
 *               department:
 *                 type: string
 *               industryType:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               skillsRequired:
 *                 type: string
 *               description:
 *                 type: string
 *               qualification:
 *                 type: string
 *               location:
 *                 type: array
 *               minExperience:
 *                 type: decimal128
 *               maxExperience:
 *                 type: decimal128
 *               employmentType:
 *                 type: string
 *               duration:
 *                 type: string
 *               workMode:
 *                 type: string
 *               status:
 *                 type: string
 *               jobRole:
 *                 type: string
 *               tags:
 *                 type: array
 *             example:
 *               department: fake department
 *               industryType: fake industryType
 *               responsibilities: fake responsibilities
 *               skillsRequired: fake skillsRequired
 *               description: fake description
 *               qualification: fake qualification
 *               location: [ fake, location]
 *               minExperience: 2
 *               maxExperience: 3
 *               jobRole: 63ecbfb56eca1d3e7036d9b9
 *               employmentType: fake employmentType
 *               duration: fake duration
 *               workMode: fake workMode
 *               status: fake status
 *               tags: [ Reactjs, Nodejs]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobOpening'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createJobOpening = catchAsync(async (req, res) => {
  const jobOpening = await jobOpeningService.createJobOpening(await addAuditFields(req, 'createAPi'));
  res.status(httpStatus.CREATED).send({ jobOpening });
});

/**
 * @swagger
 * /jobOpening:
 *   get:
 *     summary: Get all job Openings
 *     description: Only recruiter, candidate & admin can retrieve all job Openings.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: department
 *       - in: query
 *         name: industryType
 *         schema:
 *           type: string
 *         description: industryType
 *       - in: query
 *         name: responsibilities
 *         schema:
 *           type: string
 *         description: responsibilities
 *       - in: query
 *         name: skillsRequired
 *         schema:
 *           type: string
 *         description: skillsRequired
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: description
 *       - in: query
 *         name: qualification
 *         schema:
 *           type: string
 *         description: qualification
 *       - in: query
 *         name: location
 *         schema:
 *           type: Array
 *         description: location
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: number
 *         description: minExperience
 *       - in: query
 *         name: maxExperience
 *         schema:
 *           type: number
 *         description: maxExperience
 *       - in: query
 *         name: jobRole
 *         schema:
 *           type: string
 *         description: jobRole
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: employmentType
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: duration
 *       - in: query
 *         name: workMode
 *         schema:
 *           type: string
 *         description: workMode
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *         description: tags
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
 *                     $ref: '#/components/schemas/JobOpening'
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

const getJobOpenings = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(
    pick(req.query, [
      'department',
      'industryType',
      'responsibilities',
      'skillsRequired',
      'description',
      'qualification',
      'location',
      'minExperience',
      'maxExperience',
      'jobRole',
      'employmentType',
      'duration',
      'workMode',
      'status',
      'tags',
      'secondarySkills',
      'shortJD',
      'isGenerateQA'
    ]),
    req.user
  );
  if (!req.query.status) {
    filter.status = ['Published', 'Draft'];
  } else {
    filter.status = req.query.status;
  }
  console.log(req.query);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  console.log(options);
  const result = await jobOpeningService.queryJobOpenings(filter, options);
  res.send(result);
});

/**
 * @swagger
 * /jobOpening/{jobOpeningId}:
 *   get:
 *     summary: Get a job Opening
 *     description: Only recruiter can fetch job Opening.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *         description: jobOpening id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobOpening'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const getJobOpening = catchAsync(async (req, res) => {
  let queryValue;
  if(req.query.isGenerateQA) {
  queryValue = JSON.parse(req.query.isGenerateQA)
  }
  let role = JSON.parse(JSON.stringify(await jobOpeningService.getJobOpeningById(req.params.jobOpeningId,queryValue)));
  role.isGenerateQA = queryValue;

  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  const getJobAppliedNumber = await jobOpeningService.JobAppliedNumber(req.params.jobOpeningId);
  const applicants = getJobAppliedNumber.length;

  role['applicants'] = { results: getJobAppliedNumber, totalRecords: applicants };
 

  res.send(role);
});

/**
 * @swagger
 * /jobOpening/{id}:
 *   patch:
 *     summary: Update a JobOpening
 *     description: Only recruiter can update JobOpening.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: JobOpening id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *               industryType:
 *                 type: string
 *               responsibilities:
 *                 type: string
 *               skillsRequired:
 *                 type: string
 *               description:
 *                 type: string
 *               qualification:
 *                 type: string
 *               location:
 *                 type: Array
 *               minExperience:
 *                 type: number
 *               maxExperience:
 *                 type: number
 *               jobRole:
 *                 type: string
 *               employmentType:
 *                 type: string
 *               duration:
 *                 type: string
 *               workMode:
 *                 type: string
 *               status:
 *                 type: string
 *               tags:
 *                 type: array
 *             example:
 *               department: department
 *               industryType: industryType
 *               responsibilities: responsibilities
 *               skillsRequired: skillsRequired
 *               description: description
 *               qualification: qualification
 *               location: [hats, html]
 *               minExperience: 2
 *               maxExperience: 3
 *               jobRole: 63585743905890320434
 *               employmentType: employmentType
 *               duration: duration
 *               workMode: workMode
 *               status: status
 *               tags: [react,node]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JobOpening'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRoles'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const updateJobOpening = catchAsync(async (req, res) => {
  const role = await jobOpeningService.updateJobOpeningById(req.params.jobOpeningId, await addAuditFields(req, 'updateAPi'));
  res.send(role);
});

/**
 * @swagger
 * /jobOpening/{jobOpeningId}:
 *    delete:
 *     summary: Delete a Job Role
 *     description: Only recruiter can delete job role.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *         description: job Opening Id
 *     responses:
 *       "200":
 *         description: job Opening deleted successfuly
 *       "302":
 *         description: can not delete this role
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const deleteJobOpening = catchAsync(async (req, res) => {
  await jobOpeningService.deleteRoleById(req.params.jobOpeningId);
  res.status(httpStatus.OK).send({ message: 'job Opening deleted successfuly' });
});

/**
 * @swagger
 * /jobOpening/relevantjobs:
 *   get:
 *     summary: Get Releventjobs for candidates
 *     description: Only candidate can retrieve relevant job Openings.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: department
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: keyword
 *       - in: query
 *         name: industryType
 *         schema:
 *           type: string
 *         description: industryType
 *       - in: query
 *         name: responsibilities
 *         schema:
 *           type: string
 *         description: responsibilities
 *       - in: query
 *         name: skillsRequired
 *         schema:
 *           type: string
 *         description: skillsRequired
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: description
 *       - in: query
 *         name: qualification
 *         schema:
 *           type: string
 *         description: qualification
 *       - in: query
 *         name: location
 *         schema:
 *           type: Array
 *         description: location
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: number
 *         description: minExperience
 *       - in: query
 *         name: maxExperience
 *         schema:
 *           type: number
 *         description: maxExperience
 *       - in: query
 *         name: jobRole
 *         schema:
 *           type: string
 *         description: jobRole
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *         description: employmentType
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: duration
 *       - in: query
 *         name: workMode
 *         schema:
 *           type: string
 *         description: workMode
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: tags
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobOpening'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total Relevantjobs:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getRelevantJobs = catchAsync(async (req, res) => {
  const resumeid = req.user.resume;
  if (resumeid === undefined) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume is not Found');
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'keyword']);
  const result = await jobOpeningService.filterJobsByCandidateskills(resumeid, options);
  res.send(result);
});

/**
 * @swagger
 * /jobOpening/filter:
 *   post:
 *     summary: Filter the jobopenings
 *     description: candidate,admin,recruiter & employer can retrieve relevant job Openings.
 *     tags: [JobOpening]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *               - showRelvantJobs
 *               - filter
 *             properties:
 *               keyword:
 *                 type: string
 *               showRelvantJobs:
 *                 type: boolean
 *               filter:
 *                 type: object
 *                 properties:
 *                    location:
 *                      type: array
 *                    education:
 *                      type: string
 *                    jobRole:
 *                      type: array
 *                    company:
 *                      type: array
 *                    jobType:
 *                      type: string
 *                    industry:
 *                      type: string
 *                    experience:
 *                      type: object
 *                      properties:
 *                         operator:
 *                           type: string
 *                         number:
 *                           type: number
 *               sortBy:
 *                  type: integer
 *               limit:
 *                  type: integer
 *               page:
 *                  type: integer
 *             example:
 *              filters: { "location": ['agra'],  "experience": { "number": 2, "operator": "equal"}, "jobRole": [],"company":[] }
 *              export: false
 *              type: "excel"
 *              columns: []
 *              sortBy: name:asc
 *              limit: 10
 *              page: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobOpening'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total Relevantjobs:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const advanceSearchFilter = catchAsync(async (req, res) => {
  const resumeid = req.user.resume;
  if (req.body.showRelvantJobs && resumeid === undefined) {
    // throw new ApiError(httpStatus.FOUND).send({result: []});
    res.status(httpStatus.FOUND).send({results: []});
  }
  const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const filteredData = await jobOpeningService.getJobOpeningDetail(req.query, options, req.user, resumeid);
  res.send(filteredData);
});
module.exports = {
  createJobOpening,
  getJobOpenings,
  getJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getRelevantJobs,
  advanceSearchFilter,
};
