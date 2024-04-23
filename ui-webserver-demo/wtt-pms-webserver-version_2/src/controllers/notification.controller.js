const httpStatus = require('http-status');
const { emailService, tokenService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const { Resumes, User, pricingplanusageorganisation } = require('../models');
const ApiError = require('../utils/ApiError');
const pricingplan = require('../models/pricingPlans.model');

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Create a job role
 *     description: Only recruiter,admin & employer send email notification.
 *     tags: [Notification]
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
 *               JobOpeningId:
 *                 type: string
 *               bccList:
 *                 type: string
 *               toList:
 *                 type: array
 *               ccList:
 *                 type: array
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *             example:
 *               JobOpeningId: hg546gbns7836738h
 *               toList: ["shivam.chaudhary@walkingtree.tech"]
 *               bccList: ["chaudharyshivam799@gmail.com"]
 *               ccList: ["vijay.singh@walkingtree.tech"]
 *               subject: "check"
 *               body: "testnn"
 *     responses:
 *       "201":
 *         description: Please check your mail inbox
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/notification'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */


const createnotification = catchAsync(async (req, res) => {
  const recruiterCreatedBy = await User.findById(req.user.createdByUserId);
  const plan = await pricingplan.findOne({_id: recruiterCreatedBy.pricingPlan});
  const pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization,name: plan.name})));
  const filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'EMAIL_RESTRICTION');
  console.log(filteredObject,'filteredObject');
  let result = [];
  let msg;
  result = await Resumes.find({ email: req.body.bccList });
  if (result.length == 0) {
    msg = 'Email id does not exist';
  } else {
    msg = 'Sent the mail';
    if(filteredObject.actual >= filteredObject.value) {
      throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
    }
    emailService.notificationEmail(result, req, tokenService.generateTokenCandidateInvite);
    filteredObject.actual += 1;
    let getData = (await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization}));
    Object.assign(getData, pricingPlanDetail);
    getData.save();
  }
  res.status(httpStatus.CREATED).send({ message: msg });
});

module.exports = { createnotification };
