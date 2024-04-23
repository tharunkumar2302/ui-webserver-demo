const httpStatus = require('http-status');
const { User, SystemRole, pricingplanusageorganisation } = require('../models');
const ApiError = require('../utils/ApiError');
const { generalEmails } = require('../utils/helper');
const pricingplan = require('../models/pricingPlans.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.emailAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const role = await SystemRole.findById(userBody.role);
  if(role.name == "employer") {
    if(generalEmails.some((emails) => userBody.emailAddress.includes(emails))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please register with coporate email Id');
    }
  }
  const user = await User.create(userBody);
  

  return User.findById(user.id).populate('organization').populate('role').populate('resume');
};
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createRecruiter = async (userBody) => {
  if (await User.isEmailTaken(userBody.emailAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const recruiterCreatedBy = await User.findById(userBody.createdByUserId);
  const plan = await pricingplan.findOne({_id: recruiterCreatedBy.pricingPlan});
  const pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization,name: plan.name})));
  const filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'RECRUITER_RESTRICTION');
  if(filteredObject.actual >= filteredObject.value) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
  }
  const user = await User.create(userBody);
  filteredObject.actual += 1;
  let getData = (await pricingplanusageorganisation.findOne({organization: recruiterCreatedBy.organization}));
  Object.assign(getData, pricingPlanDetail);
  await getData.save();


  return User.findById(user.id).populate('organization').populate('role').populate('resume');
};


const createEmployer = async (userBody) => {
  if (await User.isEmailTaken(userBody.emailAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return User.findById(user.id).populate('organization').populate('role').populate('resume');
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, organization) => {
  return (organization ? User.findOne({ _id: id, organization }) : User.findById(id))
    .populate('organization')
    .populate('role')
    .populate('resume');
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ emailAddress: email }).populate('organization').populate('role').populate('resume');
};

/**
 * Update recruiters by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, type = '') => {
  const user = await getUserById(userId);
  // eslint-disable-next-line no-param-reassign
  delete updateBody.id;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  } else if (type === 'recruiters' && user.role === (await SystemRole.findOne({ name: 'recruiter' }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recruiter Not Found');
  }
  if (updateBody.emailAddress && (await User.isEmailTaken(updateBody.emailAddress, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  // Object.assign(user, {...updateBody, role: toString.call(updateBody.role).slice(8,-1) === 'Object'?updateBody.role.id: updateBody.role });
  await user.save();
  return User.findById(user.id).populate('organization').populate('role').populate('resume').populate('resume');
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  createRecruiter,
  deleteUserById,
  createEmployer
};
