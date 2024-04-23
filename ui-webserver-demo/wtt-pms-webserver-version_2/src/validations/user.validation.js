const Joi = require('joi');
const { password, objectId, mobileNumber } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    designation: Joi.string().required(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    organizationName: Joi.string().required(),
    role: Joi.string(),
    inviteToken: Joi.string(),
  }),
};
const createRecruiter = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    designation: Joi.string(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    organizationName: Joi.string(),
    targetUrl: Joi.string(),
  }),
};
const updateRecruiters = {
  body: Joi.object()
    .keys({
      id: Joi.string().required().custom(objectId),
      firstName: Joi.string(),
      lastName: Joi.string(),
      designation: Joi.string(),
      mobileNumber: Joi.string().custom(mobileNumber),
      emailAddress: Joi.string().email(),
      organizationName: Joi.string(),
      targetUrl: Joi.string(),
    })
    .min(2),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    designation: Joi.string(),
    mobileNumber: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getRecruiters = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    designation: Joi.string(),
    mobileNumber: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      designation: Joi.string(),
      mobileNumber: Joi.string().custom(mobileNumber),
      emailAddress: Joi.string().email(),
      password: Joi.string().custom(password),
      role: Joi.string().custom(objectId),
    })
    .min(1),
};
const updateCurrentUser = {
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      designation: Joi.string(),
      mobileNumber: Joi.string().custom(mobileNumber),
      emailAddress: Joi.string().email(),
      password: Joi.string().custom(password),
      role: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createRecruiter,
  getRecruiters,
  updateCurrentUser,
  updateRecruiters,
};
