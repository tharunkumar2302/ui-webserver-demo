const Joi = require('joi');
const { status } = require('../config/jobApplicantStatus');
const { objectId } = require('./custom.validation');

const createApplicantForCandidate = {
  body: Joi.object().keys({
    jobApplication: Joi.string().required().custom(objectId),
    comments: Joi.string(),
  }),
};
const createApplicant = {
  body: Joi.object().keys({
    user: Joi.string().required().custom(objectId),
    jobApplication: Joi.string().required().custom(objectId),
    comments: Joi.string(),
  }),
};
const getJobApplicantById = {
  param: Joi.object().keys({
    jobApplicantId: Joi.string().required().custom(objectId),
  }),
};
const updateJobApplicantById = {
  param: Joi.object().keys({
    jobApplicantId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    comments: Joi.string(),
    status: Joi.string().valid(...status.filter((status)=> status !== 'withDraw')),
  }),
};
const getJobApplicant = {
  query: Joi.object().keys({
    user: Joi.string(),
    jobApplication: Joi.string(),
    comments: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getJobApplicantForCandidate = {
  query: Joi.object().keys({
    jobApplication: Joi.string().custom(objectId),
    comments: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateApplicantForCandidate = {
  body: Joi.object().keys({
    jobApplication: Joi.string().required().custom(objectId),
    status: Joi.string()
      .valid(...status.filter(s => s !== 'processed' && s !== 'selected' && s !== 'closed' && s !== 'scheduled' ))
      .required(),
    comments: Joi.string(),
  }),
};

module.exports = {
  getJobApplicantForCandidate,
  createApplicantForCandidate,
  updateApplicantForCandidate,
  createApplicant,
  getJobApplicant,
  getJobApplicantById,
  updateJobApplicantById,
};
