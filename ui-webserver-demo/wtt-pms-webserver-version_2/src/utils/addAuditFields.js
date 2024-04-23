const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('./ApiError');

const addAuditFields = async (req, type, isemployer= false) => {
  const result = {
    ...req.body,
    modifiedByUserId: req.user._id,
    modifiedByUserRole: req.user.role,
  };
  if (type === 'createAPi') {
    result.createdByUserId = req.user._id;
    result.createdByUserRole = req.user.role;
  }
  if (!isemployer && req.user.organization) {
    if (result.organizationName) {
      delete result.organizationName;
    }
    result.organization = await Organization.findById(req.user.organization);
    result.organization = result.organization.id || result.organization._id;
  } else if (!result.organizationName) {
    new ApiError(httpStatus.BAD_REQUEST, 'organizationName is required');
  }

  return JSON.parse(JSON.stringify(result));
};
module.exports = addAuditFields;
