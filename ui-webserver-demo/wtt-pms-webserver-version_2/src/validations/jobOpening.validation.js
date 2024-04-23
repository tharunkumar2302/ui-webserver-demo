const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { operators } = require('../config/operators');

const createJobOpening = {
  body: Joi.object().keys({
    totalOpenings: Joi.number().required(),
    shortJD: Joi.string().required(),
    department: Joi.string().required(),
    industryType: Joi.string().required(),
    responsibilities: Joi.string().required(),
    skillsRequired: Joi.string().required(),
    secondarySkills : Joi.string().required(),
    description: Joi.string().required(),
    qualification: Joi.string().required(),
    location: Joi.array().required().min(1),
    minExperience: Joi.number().required(),
    maxExperience: Joi.number().required(),
    jobRole: Joi.string().required().custom(objectId),
    employmentType: Joi.string().required(),
    duration: Joi.string().required(),
    workMode: Joi.string().required(),
    status: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  }),
};

const getJobOpenings = {
  query: Joi.object().keys({
    totalOpenings: Joi.number(),
    shortJD: Joi.string(),
    secondarySkills : Joi.string(),
    department: Joi.string(),
    industryType: Joi.string(),
    responsibilities: Joi.string(),
    skillsRequired: Joi.string(),
    description: Joi.string(),
    qualification: Joi.string(),
    location: Joi.array(),
    minExperience: Joi.number(),
    maxExperience: Joi.number(),
    jobRole: Joi.string().custom(objectId),
    employmentType: Joi.string(),
    duration: Joi.string(),
    workMode: Joi.string(),
    status: Joi.array(),
    tags: Joi.array().items(Joi.string()),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    keyword: Joi.string().allow(null, ''),
  }),
};

const getJobOpening = {
  params: Joi.object().keys({
    jobOpeningId: Joi.string().custom(objectId),
  }),
};

const updateJobOpening = {
  params: Joi.object().keys({
    jobOpeningId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      totalOpenings: Joi.number(),
      shortJD: Joi.string(),
      secondarySkills : Joi.string(),
      department: Joi.string(),
      industryType: Joi.string(),
      responsibilities: Joi.string(),
      skillsRequired: Joi.string(),
      description: Joi.string(),
      qualification: Joi.string(),
      location: Joi.array(),
      minExperience: Joi.number(),
      maxExperience: Joi.number(),
      jobRole: Joi.string().custom(objectId),
      employmentType: Joi.string(),
      duration: Joi.string(),
      workMode: Joi.string(),
      status: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .min(1),
};

const deleteJobOpening = {
  params: Joi.object().keys({
    jobOpeningId: Joi.string().custom(objectId),
  }),
};

const advanceSearchFilter = {
  keyword: Joi.string(),
  showRelvantJobs: Joi.boolean().default(false),
  filters: Joi.object().keys({
    location: Joi.array(),
    jobRole: Joi.array(),
    company: Joi.array(),
    education: Joi.string(),
    experience: Joi.object().keys({
      number: Joi.number().max(50),
      operator: Joi.string().valid(...operators),
    }),
    jobType: Joi.string(),
    industry: Joi.string(),
  }),
  sortBy: Joi.string().allow(null, ''),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
};
module.exports = {
  createJobOpening,
  getJobOpenings,
  getJobOpening,
  updateJobOpening,
  deleteJobOpening,
  advanceSearchFilter,
};
