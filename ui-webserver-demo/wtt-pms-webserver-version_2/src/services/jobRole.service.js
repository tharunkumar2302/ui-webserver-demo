const httpStatus = require('http-status');
const { SystemRole, JobRole } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a job role
 * @param {Object} roleBody
 * @returns {Promise<User>}
 */
const createRole = async (roleBody) => {
  if (await JobRole.isRoleExists(roleBody.name, roleBody.organization)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Job Role already exists');
  }
  const jobRole = await JobRole.create(roleBody);
  return JobRole.findById(jobRole._id || jobRole.id).populate('organization');
};
/**
 * Create a system role
 * @param {Object} roleBody
 * @returns {Promise<User>}
 */
const populateSystemRoleData = async (userBody) => {
  if (userBody.role && !(await SystemRole.isRoleExists(userBody.role))) {
    const rolesData = await SystemRole.find({});
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid Role, Valid Roles are : [${rolesData.map((role) => role.name).join(', ')}]`
    );
  }

  const data = { ...userBody };
  let { role } = userBody;

  if (userBody.role && (await SystemRole.isRoleExists(userBody.role))) {
    role = await SystemRole.findOne({ name: role });
  } else {
    role = await SystemRole.findOne({ name: 'employer' });
  }

  data.role = role.id || role._id;

  return data;
};

/**
 * Query for System Roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  const rolesData = await JobRole.paginate(filter, options);
  stringToHtml(['description'], rolesData.results);
  return rolesData;
};


const stringToHtml = (fieldsKey, dataArray) => {
  fieldsKey.forEach((key) => {
    dataArray?.length &&dataArray.forEach((data) => {
      data[key] = data[key]?.replaceAll('&lt;', '<');
    });
  });
};
/**
 * Get job role by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getRoleById = async (id) => {
  return JobRole.findById(id).populate('organization');
};
/**
 * Get user by name
 * @param {string} name
 * @returns {Promise<User>}
 */
const getRoleByName = async (name) => {
  return SystemRole.findOne({ name });
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.name && (await JobRole.isRoleExists(updateBody.name, roleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists');
  }
  Object.assign(role, updateBody);
  await role.save();

  return getRoleById(roleId);
};

/**
 * Delete Role by id
 * @param {ObjectId} roleId
 * @returns {Promise<User>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
  }
  role.isActive = false;
  await role.save();
  return role;
};


module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  getRoleByName,
  populateSystemRoleData,
  stringToHtml
};
