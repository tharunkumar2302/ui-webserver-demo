const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const systemRoleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdByUserId: {
      type: String,
      ref: 'User',
      required: false,
    },

    modifiedByUserId: {
      type: String,
      ref: 'User',
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
systemRoleSchema.plugin(toJSON);
systemRoleSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} roleName - The role name
 * @param {ObjectId} [excludeRoleId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
systemRoleSchema.statics.isRoleExists = async function (roleName, excludeRoleId) {
  const role = await this.findOne({ name: roleName, _id: { $ne: excludeRoleId } });
  return !!role;
};

/**
 * Check if email is taken
 * @param {string} roleId - The role id
 * @returns {Promise<boolean>}
 */
systemRoleSchema.statics.isDefaultRole = async function (roleId) {
  const role = await this.findById(roleId);
  return role.isDefault;
};

/**
 * @typedef Token
 */
const SystemRole = mongoose.model('SystemRole', systemRoleSchema);

module.exports = SystemRole;
