const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a organization
 * @param {Object} organizationBody
 * @returns {Promise<User>}
 */
const createOrganization = async (organizationBody) => {
  if (await Organization.isOrganizationExists(organizationBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization already exists');
  }
  return Organization.create(organizationBody);
};
/**
 * Create a populate OrganizationData
 * @param {Object} requestBody of create User
 * @returns {Promise<User>}
 */
const populateOrganizationData = async (requestBody) => {
  const userData = { ...requestBody };
  let org = userData.organizationName || userData.organization;
  try{
    let orgObject = await Organization.findById(org);
  if(orgObject){
    org = orgObject.name;
  }
  }catch(e){

  }
  console.log(userData,'userdata');
  if (!org) {
    return userData;
  }
  if (await Organization.isOrganizationExists(org)) {
    org = await Organization.findOne({ name: org });
  } else {
    org = await Organization.create({ name: org });
  }
  delete userData.organizationName;

  userData.organization = org.id || org._id;

  return userData;
};

/**
 * Query for organizations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrganizations = async (filter, options) => {
  const roles = await Organization.paginate(filter, options);
  return roles;
};

/**
 * Get Organization by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getOrganizationById = async (id) => {
  return Organization.findById(id);
};
/**
 * Get user by name
 * @param {string} name
 * @returns {Promise<User>}
 */
const getOrganizationByName = async (name) => {
  return Organization.findOne({ name });
};

/**
 * Update Organization by id
 * @param {ObjectId} organizationId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateOrganizationById = async (organizationId, updateBody) => {
  const role = await getOrganizationById(organizationId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'organization not found');
  }
  if (updateBody.name && (await Organization.isOrganizationExists(updateBody.name, organizationId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'organization already exists');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete organization by id
 * @param {ObjectId} roleId
 * @returns {Promise<User>}
 */
const deleteOrganizationById = async (roleId) => {
  const role = await getOrganizationById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }
  await role.remove();
  return role;
};

module.exports = {
  createOrganization,
  queryOrganizations,
  getOrganizationById,
  updateOrganizationById,
  deleteOrganizationById,
  getOrganizationByName,
  populateOrganizationData,
};
