const Joi = require('joi');

const createnotification = {
  body: Joi.object().keys({
    JobOpeningId: Joi.string(),
    bccList: Joi.array(),
    toList: Joi.array(),
    ccList: Joi.array(),
    subject: Joi.string(),
    body: Joi.string(),
  }),
};

module.exports = { createnotification };
