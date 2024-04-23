const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrganization = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

const getOrganizations = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId),
  }),
};
const getOrganizationByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const deleteOrganization = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId),
  }),
};
module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationByName,
};
