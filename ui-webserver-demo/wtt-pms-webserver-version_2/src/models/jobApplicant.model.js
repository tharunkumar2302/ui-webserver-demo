const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const jobApplicantSchema = mongoose.Schema(
  {
    organization: { type: String, ref: 'Organization', required: true },
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    jobApplication: {
      type: String,
      require: true,
      ref: 'JobOpening',
    },
    comments: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
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
      ref: 'User',
      required: false,
    },
    modifiedByUserRole: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemRole', required: false, private: true },
    createdByUserRole: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemRole', required: false, private: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobApplicantSchema.plugin(toJSON);
jobApplicantSchema.plugin(paginate);

/**
 * Check if Job application exist
 * @param {string} jobId - The mongose id of the jobOpening
 * @param {ObjectId} userID - The id of the user
 * @returns {Promise<boolean>}
 */
jobApplicantSchema.statics.isJobApplied = async function (jobId, userID) {
  const jobApp = await this.findOne({ user: userID, jobApplication: jobId });
  return jobApp;
};

/**
 * @typedef JobApplicant
 */
const JobApplicant = mongoose.model('JobApplicant', jobApplicantSchema);

module.exports = JobApplicant;
