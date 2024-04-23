const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const organizationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
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
organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} organizationName - The Organization name
 * @param {ObjectId} [excludeOrganizationId] - The id of the Organization to be excluded
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.isOrganizationExists = async function (organizationName, excludeOrganizationId) {
  const role = await this.findOne({ name: organizationName, _id: { $ne: excludeOrganizationId } });
  return !!role;
};

/**
 * @typedef Token
 */
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
