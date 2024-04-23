const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { password, mobileNumber } = require('./custom.validation');

const updateEmployerData = {
  body: Joi.object().keys({
    id: Joi.required().custom(objectId),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    designation: Joi.string().required(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    password: Joi.string().custom(password),
    organizationName: Joi.string().required(),
    role: Joi.string(),
    pricingPlan: Joi.string(),
    status: Joi.string(),
    inviteToken: Joi.string(),
  }),
};

module.exports = { updateEmployerData };
