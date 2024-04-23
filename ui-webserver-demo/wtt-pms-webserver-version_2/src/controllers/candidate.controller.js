const { tokenService, candidateService, emailService } = require('../services');
const { Resumes,User, pricingplan, pricingplanusageorganisation } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');


/**
 * @swagger
 * /candidate/invite:
 *   post:
 *     summary: Create an invite For Candidates
 *     description: Only recruiter can send the invite to the candidate.
 *     tags: [candidate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidateInvite
 *             properties:
 *               to:
 *                 type: array
 *               endpointUrl:
 *                 type: string
 *             example:
 *               to: ['abc@gmail.com','xyz@gmail.com']
 *               endpointUrl: 'candidate/invite'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/candidateInvite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

const createinviteForCandidate = catchAsync(async (req, res) => {
  let result = [];
  let resultData = {};
  let msg;
  result = await Resumes.find({ email: req.body.to });
  const recruiterCreatedBy = await User.findById(req.user.createdByUserId);
  const plan = await pricingplan.findOne({_id: recruiterCreatedBy.pricingPlan});
  const pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization,name: plan.name})));
  const filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'EMAIL_RESTRICTION');
  console.log(filteredObject,'filteredObject');
  console.log(result);
  if (result.length == 0) {
    msg = 'Email id does not exist';
  } else {
    if(filteredObject.actual >= filteredObject.value) {
      throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
    }
    filteredObject.actual += 1;
    let getData = (await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization}));
    Object.assign(getData, pricingPlanDetail);
    getData.save();
    msg = 'Sent the mail';
  }
  resultData = await candidateService.sendCandidateInvite(result, req);
  res.send({ message: msg, response: resultData });
});

/**
 * @swagger
 * /candidate/details:
 *   get:
 *     summary: Get candidates details based invite token
 *     description: Only recruiter can retrieve candidate details.
 *     tags: [candidate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: inviteToken
 *         schema:
 *           type: string
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
 *                     $ref: '#/components/schemas/candidate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getinviteForCandidate = catchAsync(async (req, res) => {
  const tokenData = req.query.inviteToken;
  const candidateDetailsObj = await candidateService.getCandidateDetail(tokenData);
  res.send({ data: candidateDetailsObj });
});

/**
 * @swagger
 * /candidate/KPI:
 *   get:
 *     summary: Get KPI Info for the candidate
 *     description: Only candidate can retrieve candidate KPI details.
 *     tags: [candidate]
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/candidate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const getCandidateView = catchAsync(async (req, res) => {
  const candidateResumeData = await candidateService.candidateDetailsView(req);
  res.send({ data: candidateResumeData });
});
module.exports = { createinviteForCandidate, getinviteForCandidate, getCandidateView };
