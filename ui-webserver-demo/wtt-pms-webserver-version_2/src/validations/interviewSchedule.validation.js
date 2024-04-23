const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createScheduleForInterview = {
  body: Joi.object().keys({
    candidateEmail: Joi.string().required(),
    candidateFirstname: Joi.string().required(),
    jobId: Joi.string().custom(objectId).required(),
    meetingLink: Joi.string().allow(''),
    provider: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.object().keys({
      start: Joi.string().required(),
      end: Joi.string().required(),
    }),
    Attendee: Joi.array().required(),
    resumeId: Joi.string().allow(null,''),
    primarySkills: Joi.array().allow(null,''),
    secondarySkills: Joi.string().allow(null,''),
    status: Joi.string().allow(null,''),
    location: Joi.string().required()
  }),
};

const updateResultPdf = {
  body: Joi.object().keys({
    interviewid: Joi.string().custom(objectId).required(),
    resultFileLink: Joi.string().required(),
  }),
};

const deleteScheduleInterview = {
  params: Joi.object().keys({
    interviewId: Joi.string().custom(objectId),
  }),
};

const getSearchedProfiles = {
  query: Joi.object().keys({
    email: Joi.string().allow(''),
  }),
}


const getInterviewData = {
  params: Joi.object().keys({
    interviewId: Joi.string().custom(objectId),
  }),
};

const getAllScheduleInterviews = {
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
}

module.exports = { createScheduleForInterview, updateResultPdf,deleteScheduleInterview,getSearchedProfiles,getInterviewData,getAllScheduleInterviews };
