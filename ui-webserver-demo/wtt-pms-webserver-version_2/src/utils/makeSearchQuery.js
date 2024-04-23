const httpStatus = require('http-status');
const { roleRights } = require('../config/roles');
const { SystemRole } = require('../models');
const ApiError = require('./ApiError');


/**
 * Create an regularExp for search
 * @param {string} filterText
 * @returns {RegExp}
 */
const regularExpForField = (filterText) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(`^(.*?(${filterText})[^$]*)`, 'i');
};

/**
 * Create an object composed of regularExp for search
 * @param {Object} filter
 * @param {Object} user  //Optional parameter if send then need to filter records based on the organization
 * @returns {Object}
 */
const makeSearchQueryForFields = async (filter, user) => {
  const result = {};
  if (user?.role) {
    const role = (await SystemRole.findById(user.role))?.name;
    if (user?.organization && roleRights.get(role)?.includes('orgFilter')) {
      result['organization'] = user.organization;
    }
  }
  Object.keys(filter).forEach((filterKey) => {
    result[filterKey] = filterKey === 'isActive'?filter[filterKey]: regularExpForField(filter[filterKey]);
  });
  console.log(result,'orgg');
  return result;
};

module.exports = { makeSearchQueryForFields, regularExpForField };
