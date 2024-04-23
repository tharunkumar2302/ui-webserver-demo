const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createinviteForCandidate = {
  body: Joi.object().keys({
    to: Joi.array().required(),
    endpointUrl: Joi.string(),
  }),
};

const getinviteForCandidate = {
  param: Joi.object().keys({
    inviteToken: Joi.string().required().custom(objectId),
  }),
};

module.exports = { createinviteForCandidate, getinviteForCandidate };
