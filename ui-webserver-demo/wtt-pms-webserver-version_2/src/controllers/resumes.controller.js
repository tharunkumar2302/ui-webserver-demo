const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
var multerS3 = require('multer-s3');
const { resumeService, organizationService, userService } = require('../services');
const addAuditFields = require('../utils/addAuditFields');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { KPI, Resumes, User, pricingplanusageorganisation, Profile, SystemRole } = require('../models');
const { exportData } = require('../utils/excelFormating');
const { getResumeByMultipleKeywords, downloadProfile } = require('../services/resume.service');
const pricingplan = require('../models/pricingPlans.model');
const { log } = require('handlebars');
const date = Date.now();
const createResume = catchAsync(async (req, res) => {
  const resume = await resumeService.createResume(await addAuditFields(req, 'createAPi'));
  resumeService.updateResumeView(req.user || {});
  res.status(httpStatus.CREATED).send(resume);
});
const createResumeForCurrentUser = catchAsync(async (req, res) => {
  if (req.user && req.user.resume) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Resume already uploaded.');
  } else {
    const resume = await resumeService.createResume(await addAuditFields(req, 'createAPi'));
    await userService.updateUserById(req.user._id || req.user.id, { resume: resume._id || resume.id });
    resumeService.updateResumeView(req.user || {});
    res.status(httpStatus.CREATED).send(resume);
  }
});

/**
 * @swagger
 * /resumes/kpi:
 *   get:
 *     summary: Get the Resume View.
 *     description: Only admins & recruiter can get the all resmues.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getResumeView = catchAsync(async (req, res) => {
  resumeService.updateResumeView(req.user || {});
  const org = await makeSearchQueryForFields({}, req.user);
  let kpi;
  if (org.organization) {
    kpi = await KPI.findOne({ organization: org.organization });
  } else kpi = await KPI.findOne({});

  res.send(kpi);
});

const getallResumes = catchAsync(async (req, res) => {
  let multipleKeywords;
  if(req.query['keyword'] !== undefined) {
    multipleKeywords = req.query['keyword'].split(/[\s,]+/);
    req.query['keyword'] = multipleKeywords[0].toLowerCase();
  }
  const filter = await makeSearchQueryForFields(
    pick(req.query, [
      'firstName',
      'lastName',
      'email',
      'phone_no',
      'current_location',
      'marital_status',
      'present_address',
      'date_of_birth',
      'current_designation',
      'current_company',
      'experience',
      'education',
      'primary_skill',
      'secondary_skill',
      'education_details',
      'experience_details',
      'current_ctc',
      'expected_ctc',
      'industry',
      'notice_period',
      'prefered_location',
      'ready_to_relocate',
      'overseas_experience',
      'having_passport',
      'passport_validity',
      'visa',
      'file_path',
      'About',
      'status',
    ]),
    req.user
  );

  if (!req.query.status) {
    filter.status = ['Published', 'Draft'];
    // if(!req.query.cvNotUpload){
    //   filter.file_path = { $regex: /uploadedfiles/ };
    // }
    // filter.createdByUserId= ' '
  } else {
    filter.status = req.query.status;

  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await resumeService.getResumes(filter, options, req.user, req.query);
  if ((multipleKeywords ?? '')?.length >= 1 ) {
    // filter.file_path = { $regex: /uploadedfiles/ };
    // res.send({ results: getResumeByMultipleKeywords(multipleKeywords, result.results) });\
    res.send({ results: result.results ,
      totalResults: result.results.length,
      totalPages: Math.ceil(result.results.length / 10),
      currentPage: 1,
      pageSize: 10
})

  }
  else
    if (req.query.export) {
      res.download(result);
    } else {
      res.send(result);
    }
  // res.send(result);
});

const getResume = catchAsync(async (req, res) => {
  const resume = await resumeService.getResumeById(req.params._id);
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume is not found');
  }
  res.send(resume);
});
const getResumeForCurrentUser = catchAsync(async (req, res) => {
  const resume = await resumeService.getResumeById(req.user.resume);
  // const resume = await resumeService.getResumeById(req.user._id || req.user.id);
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume is not found');
  }
  res.send(resume);
});

const updateResume = catchAsync(async (req, res) => {
  const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'updateAPi'));
  const updateresume = await resumeService.updateResumeById(req.params._id, data,req.user);

  resumeService.updateResumeView(req.user || {});
  res.send(updateresume);
});
const updateResumeForCurrentUser = catchAsync(async (req, res) => {
  if (req.user && req.user.resume) {
    const data = await organizationService.populateOrganizationData(await addAuditFields(req, 'updateAPi'));
    const updateresume = await resumeService.updateResumeById(req.user.resume, data,req.user);
    resumeService.updateResumeView(req.user || {});
    res.send(updateresume);
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'Please first create resume before updating it.');
  }
});

const deleteResume = catchAsync(async (req, res) => {
  await resumeService.deleteResumeById(req.params._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @swagger
 * /resumes/searchFilter:
 *   get:
 *     summary: Filter the resume based on the searched keyword
 *     description: Only admins & recruiter can get the all resmues.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                  type: string
 *               sortBy:
 *                  type: integer
 *               limit:
 *                  type: integer
 *               page:
 *                  type: integer
 *             example:
 *              query: "excel"
 *              sortBy: name:asc
 *              limit: 10
 *              page: 1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getResumesbyKeyword = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await resumeService.getResumesbyKeyword(req.query.keyword.trim(), options, req.user);
  res.send(result);
});

/**
 * @swagger
 * /resumes/searchFilter:
 *   post:
 *     summary: Filter the resume
 *     description: Only admins& recruiter can get the all resmues.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 properties:
 *                    location:
 *                      type: array
 *                    education:
 *                      type: array
 *                    skills:
 *                      type: array
 *                    employmentStatus:
 *                      type: array
 *                    prefferedLocation:
 *                      type: array
 *                    experience:
 *                      type: object
 *                      properties:
 *                         number:
 *                           type: number
 *                         operator:
 *                           type: string
 *                    ctc:
 *                      type: object
 *                      properties:
 *                         number:
 *                           type: number
 *                         operator:
 *                           type: string
 *                    noticePeriod:
 *                      type: object
 *                      properties:
 *                         number:
 *                           type: number
 *                         operator:
 *                           type: string
 *               export:
 *                  type: boolean
 *               columns:
 *                  type: array
 *               type:
 *                  type: string
 *               sortBy:
 *                  type: integer
 *               limit:
 *                  type: integer
 *               page:
 *                  type: integer
 *             example:
 *              filters: { "location": ['agra'],  "experience": { "number": 2, "operator": "equal"}, "education":[], "skills":[], "ctc":{"number":2,  "operator": "equal"}, "employmentStatus": ["openToWork"], "noticePeriod": {"number":2,"operator": "equal" }, "prefferedLocation": [] }
 *              export: false
 *              type: "excel"
 *              columns: []
 *              sortBy: name:asc
 *              limit: 10
 *              page: 1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getFilteredSearchData = catchAsync(async (req, res) => {
  const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const result = await resumeService.getFilteredSearchData(req.body, options, req.user);

  if (req.body.export) {
    res.download(result);
  } else {
    res.send(result);
  }
});
const profileUpload = catchAsync(async (req, res) => {
  // console.log(req.body,'link');
  let filteredObject;
  let pricingPlanDetail;
  let plan;
  const currentUser = req.user;
  const employerData = await User.findById(currentUser.createdByUserId);
  const roles = await SystemRole.findById(currentUser.role);
  if(roles.name == 'recruiter') {
  plan = await pricingplan.findOne({_id: employerData.pricingPlan});
  pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: employerData.organization,name: plan.name})));
  filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'PROFILES_RESTRICTION');
  if((filteredObject.value-filteredObject.actual) < req.query.filesCount) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
  }
}
  resumeService.profileUpload(req, currentUser, async function (err, resumes) {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).send({ message: err.message, status: httpStatus.BAD_REQUEST, success: false });

      throw err;
    } else {
      res.status(httpStatus.CREATED).send(resumes);
      if(roles.name == 'recruiter') {
      filteredObject.actual += +req.query.filesCount;
      let getData = (await pricingplanusageorganisation.findOne({organization: employerData.organization}));
      Object.assign(getData, pricingPlanDetail);
      getData.save();
      }
    }
  });
});

/**
 * @swagger
 * /resumes/importTemplate:
 *   get:
 *     summary: Download import template
 *     description: anyone can access.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getImortTemplate = catchAsync(async (req, res) => {
  const requireColumns = Object.keys(Resumes.schema.tree).filter(
    (key) => key !== 'organization' && key !== 'source' && key !== 'status' && Resumes.schema.tree[key].required
  );
  const importObj = {};
  requireColumns.map((data) => {
    importObj[`${data} ${Resumes.schema.tree[data].in ? `( in ${Resumes.schema.tree[data].in})` : ''} `] =
      Resumes.schema.tree[data].sample;
    return importObj[data];
  });

  const file = await exportData([importObj], 'excel', 'resumeImportTemplate');
  res.download(file);
});
/**
 * @swagger
 * /resumes/import:
 *   post:
 *     summary: Import resumes using import template
 *     description: anyone can access.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                resumes:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const importResumes = catchAsync(async (req, res) => {
  await resumeService.uploadExcelFile(req,req.user);
  const result = await resumeService.importResumes(req, req.user);
  let role = await SystemRole.findById(req.user.role);
  if(role.name === "recruiter") {
    plan = await pricingplan.findOne({_id: req.user.pricingPlan});
    pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: req.user.organization,name: plan.name})));
    filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'PROFILES_RESTRICTION');
    console.log(filteredObject,'filterObject');
    if((filteredObject.value-filteredObject.actual) < req.query.filesCount) {
      throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
    }
  }
  if(role.name == 'recruiter') {
    filteredObject.actual += result.length;
    let getData = (await pricingplanusageorganisation.findOne({organization: req.user.organization}));
    Object.assign(getData, pricingPlanDetail);
    getData.save();
    }
  res.send({result,length: result.length});
});
/**
 * @swagger
 * /resumes/export:
 *   post:
 *     summary: Import resumes using import template
 *     description: anyone can access.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *               columns:
 *                 type: array
 *             example:
 *              ids: ['63f71cd00b289a6ee88bf282', '63f752f9b090529af0f403ee']
 *              columns: ['S.No.', 'id', 'current_designation']
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const exportResumes = catchAsync(async (req, res) => {
  const result = await resumeService.exportResumes(req.body.ids, req.body.columns);
  res.download(result);
});

/**
 * @swagger
 * /resumes/downloadresume/{_id}:
 *   get:
 *     summary: Download resume using file url.
 *     description: anyone can access.
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Resume'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
const downloadResume = catchAsync(async (req, res) => {
  const resumeDetails = await Resumes.findById(req.params._id);
  console.log(resumeDetails,'resumeDetails');
  console.log(resumeDetails.cv_url,'resumeDetails');
  const resumeId = resumeDetails.cv_url?.split('/');
  if (!resumeDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'id is not found');
  } else {
    downloadProfile(resumeId[5],resumeDetails.file_path).then((path)=> {
      res.download(path);
    }, (rej)=>{
      throw ApiError();
    })
    // var filename = resumeDetails.firstName + resumeDetails.lastName;
    // resumeService.downloadResumeById(resumeDetails, function (err, pdfBuffer) {
    //   if (err) {
    //     throw err;
    //   } else {
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', `attachment; filename=${filename}-${date}.pdf`);
    //     res.send(pdfBuffer);
    //   }
    // });
  }
});

const resumeDownload = catchAsync(async(req,res) => {
  console.log(req.user,'request');
  const resume = await Resumes.findOne({_id: req.user.resume})
  // console.log(resume);
  const resumeId = resume.cv_url.split('/');
  // console.log(resumeId[5]);
  downloadProfile(resumeId[5],resume.file_path).then((path)=> {
    res.download(path);
  }, (rej)=>{
    throw ApiError();
  })
})
module.exports = {
  createResume,
  getallResumes,
  getResume,
  updateResume,
  deleteResume,
  getResumesbyKeyword,
  getFilteredSearchData,
  getResumeView,
  createResumeForCurrentUser,
  updateResumeForCurrentUser,
  getResumeForCurrentUser,
  getImortTemplate,
  importResumes,
  profileUpload,
  exportResumes,
  downloadResume,
  resumeDownload
};
