const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getPlan = {
  params: Joi.object().keys({
    plan: Joi.string(),
    organisationId: Joi.string()
  }),
};

module.exports = { getPlan };
