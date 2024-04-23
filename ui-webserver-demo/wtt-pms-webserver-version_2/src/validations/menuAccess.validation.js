const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMenuAccess = {
  body: Joi.object().keys({
    role: Joi.string(),
    screen: Joi.array().required(),
  }),
};

const updateMenuAccess = {
  body: Joi.object().keys({
    role: Joi.string().required(),
    screen: Joi.array().required(),
  }),
};

const deleteMenuAccess = {
  params: Joi.object().keys({
    role: Joi.string().custom(objectId),
  }),
};

module.exports = { createMenuAccess, updateMenuAccess, deleteMenuAccess };
