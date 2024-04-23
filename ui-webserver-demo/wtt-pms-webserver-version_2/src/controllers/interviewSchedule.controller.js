const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const addAuditFields = require('../utils/addAuditFields');
const {
  pricingplanusageorganisation,
  pricingplan,
  pricingPlanRules,
  JobOpening,
  User,
  Organization,
  JobRole,
  Resumes,
} = require('../models');
const ApiError = require('../utils/ApiError');
const interviewSchedule = require('../models/interviewSchedule.model');
const { authorize, getgoogleToken,SendingMail } = require('../services/calenderEvent.service');
const { google } = require('googleapis');
const pick = require('../utils/pick');
const { makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { calenderService } = require('../services');

/**
 * @swagger
 * /interviewSchedule/createInterviewMeeting:
 *   post:
 *     summary: Create an interview meeting invite For Candidates
 *     description: Only recruiter can send the invite to the candidate.
 *     tags: [interviewSchedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateEmail:
 *                 type: string
 *               candidateFirstname:
 *                 type: string
 *               jobId:
 *                 type: string
 *               meetingLink:
 *                 type: string
 *               provider:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: object
 *                 properties:
 *                    start:
 *                      type: string
 *                    end:
 *                      type: string
 *               Attendee:
 *                 type: array
 *               resumeId:
 *                 type: string
 *               primarySkills:
 *                 type: array
 *               secondarySkills:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               candidateEmail: fake email
 *               candidateFirstname: fake name
 *               jobId: fake id
 *               meetingLink: fake link
 *               provider: google meeting/zoom meeting
 *               date: fake date
 *               time: {'start': start time,'end': end time}
 *               Attendee: ['abc@gmail.com','xyz@gmail.com']
 *               resumeId: fake resume id
 *               primarySkills: fake pSkills
 *               secondarySkills: fake sSkills
 *               status: Y
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/interviewSchedule'
 *       "400":
 *         $ref: '#/components/responses/DuplicateRole'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const createScheduleForInterview = catchAsync(async (req, res) => {
  req.body.Attendee.push({ email: req.user.emailAddress });
  let statusValue;
  if (req.body.status === '') {
    statusValue = 'N';
  } else {
    statusValue = req.body.status;
  }
  const cEmail = Object.create({});
  cEmail.email = req.body.candidateEmail;
  let data = await interviewSchedule.create({
    scheduleByUserid: req.user._id,
    candidateEmail: cEmail,
    candidateFirstname: req.body.candidateFirstname,
    jobId: req.body.jobId,
    meetingLink: req.body.meetingLink,
    provider: req.body.provider,
    date: req.body.date,
    time: req.body.time,
    Attendee: req.body.Attendee,
    resumeId: req.body.resumeId,
    primarySkills: req.body.primarySkills,
    secondarySkills: req.body.secondarySkills,
    status: statusValue,
    location: req.body.location
  });
  req.body.scheduleByUserid = req.user._id;
  let popUpOpen;
  if (req.body.provider === 'google meeting' || req.body.provider === 'zoom meeting') {
    const accessdata = await authorize(data._id || data.id);
    req.body.meetingLink = req.body.meetingLink;
    result = `${accessdata}`;
  }
  res.send(result);
});

const createSchedule = catchAsync(async (req, res) => {
  console.log('createMeeting');
  const qdata = JSON.parse(req.query.state);
  if (qdata.endPoint == 'cancelInterviewcallback') {
    deleteSchedule(req, res, qdata);
    return;
  }
  const id = qdata.id;
  const link = await getgoogleToken(req.query.code, id);
  await interviewSchedule.updateOne({ _id: id }, { $set: { meetingLink: link } });
  const eventData = await interviewSchedule.findById(id);
  console.log(eventData,'eventData');
  await SendingMail(eventData, false);
  res.send(`<script>window.close();</script > `);
});

/**
 * @swagger
 * /interviewSchedule/scheduleInterviews:
 *   get:
 *     summary: Get all Scheduled interviews
 *     description: Only recruiter can retrieve all Scheduled interviews.
 *     tags: [interviewSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *                     $ref: '#/components/schemas/interviewSchedule'
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


const getAllScheduleInterviews = catchAsync(async (req, res) => {
  const interviewData = await interviewSchedule.paginate();
  Promise.all(
    interviewData.results.map(async (element, index) => {
      const job = await JobRole.findById(element.jobId.jobRole);
      element.jobId = job;
    })
  ).then(async () => {
    res.send(interviewData);
  });
});

const updateResultPdf = catchAsync(async (req, res) => {
  await interviewSchedule.updateOne({ _id: req.body.interviewid }, { $set: { interviewResult: req.body.resultFileLink } });
  res.send('data updated');
});

/**
 * @swagger
 * /cancelInterview/{id}:
 *    delete:
 *     summary: Delete a Job Role
 *     description: Only recruiter can delete schedule interview.
 *     tags: [interviewSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         interviewId: id
 *         required: true
 *         schema:
 *           type: string
 *         description: interviewId
 *     responses:
 *       "200":
 *         description: schedule interview deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

const deleteInterviewById = catchAsync(async (req, res) => {
  const dataAccess = await authorize(req.query.interviewId, 'cancelInterviewcallback');
  result = `${dataAccess}`;
  res.send(result);
});

const deleteSchedule = catchAsync(async (req, res, data) => {
  let states = JSON.parse(req.query.state);
  const eventData = await interviewSchedule.findById(states.id);
  getgoogleToken(req.query.code, states.id, true);
  calenderService.SendingMail(eventData, true);
  res.send(`<script>window.close();</script > `);
});

const getSearchedProfiles = catchAsync(async (req, res) => {
  const filter = await makeSearchQueryForFields(pick(req.query, ['email']), req.user);
  const filteredData = await Resumes.paginate(filter, {});
  res.send({ results: filteredData });
});

/**
 * @swagger
 * /interviewSchedule/:interviewId:
 *   get:
 *     summary: Get Scheduled interviews by paasing interviewId
 *     description: Only recruiter can retrieve Scheduled interview.
 *     tags: [interviewSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         interviewId: id
 *         schema:
 *           type: string
 *         description: interview Id
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
 *                     $ref: '#/components/schemas/interviewSchedule'
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


const getInterviewData = catchAsync(async (req, res) => {
  let queryValue;
  if (req.query.isGenerateQA) {
    queryValue = JSON.parse(req.query.isGenerateQA);
  }
  let data = JSON.parse(JSON.stringify(await calenderService.getinterviewDataById(req.params.interviewId, queryValue)));
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is no interview schedule');
  }
  data.isGenerateQA = queryValue;
  res.send(data);
});

module.exports = {
  createScheduleForInterview,
  createSchedule,
  getAllScheduleInterviews,
  updateResultPdf,
  deleteInterviewById,
  deleteSchedule,
  getSearchedProfiles,
  getInterviewData,
};
