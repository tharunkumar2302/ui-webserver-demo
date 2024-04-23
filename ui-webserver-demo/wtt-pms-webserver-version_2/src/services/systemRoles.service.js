const httpStatus = require('http-status');
const { SystemRole } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { allRoles, roles } = require('../config/roles');

/**
 * Create a system role
 * @param {Object} roleBody
 * @returns {Promise<User>}
 */
const createRole = async (roleBody) => {
  logger.debug(JSON.stringify(roleBody));
  if (await SystemRole.isRoleExists(roleBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists');
  }
  if (!roles.includes(roleBody.name)) {
    allRoles[roleBody.name] = [];
  }
  return SystemRole.create(roleBody);
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
  const rolesData = await SystemRole.paginate(filter, options);
  return rolesData;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getRoleById = async (id) => {
  return SystemRole.findById(id);
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
  if (updateBody.name && (await SystemRole.isRoleExists(updateBody.name, roleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists');
  }
  if (await SystemRole.isDefaultRole(roleId)) {
    throw new ApiError(httpStatus.FOUND, `cannot modify ${role.name} role`);
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
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
  if (await SystemRole.isDefaultRole(roleId)) {
    throw new ApiError(httpStatus.FOUND, `cannot delete ${role.name} role`);
  }

  await role.remove();
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
};
