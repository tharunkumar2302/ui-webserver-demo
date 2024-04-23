const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const jobRoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdByUserId: {
      type: String,
      required: false,
      ref: 'User',
    },

    modifiedByUserId: {
      type: String,
      required: false,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobRoleSchema.plugin(toJSON);
jobRoleSchema.plugin(paginate);

/**
 * Check if Job role exist
 * @param {string} roleName - The role name
 * @param {ObjectId} org - The organization ID
 * @param {ObjectId} [excludeRoleId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
jobRoleSchema.statics.isRoleExists = async function (roleName, org, excludeRoleId) {
  const role = await this.findOne({ name: roleName, organization: org, _id: { $ne: excludeRoleId } });
  return !!role;
};
/**
 *  Check if Job role exist
 * @param {string} roleId - The role Id
 * @returns {Promise<boolean>}
 */
jobRoleSchema.statics.isRoleExistsById = async function (roleId) {
  const role = await this.findById(roleId);
  return !!role;
};

/**
 * @typedef JobRole
 */
const JobRole = mongoose.model('JobRole', jobRoleSchema);

module.exports = JobRole;
