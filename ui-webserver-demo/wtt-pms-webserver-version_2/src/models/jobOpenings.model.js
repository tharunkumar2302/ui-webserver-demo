const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

function getValue(value) {
  if (typeof value !== 'undefined') {
    return parseFloat(value.toString());
  }
  return value;
}
const jobOpeningSchema = mongoose.Schema(
  {
    totalOpenings: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
      get: getValue,
    },
    department: {
      type: String,
    },
    isGenerateQA: {
      type: Boolean,
      default:false
    },
    industryType: {
      type: String,
    },
    responsibilities: {
      type: String,
    },

    skillsRequired: {
      type: String,
      required: true,
      trim: true,
    },
    secondarySkills: {
      type: String,
      required: true,
      trim: true,
    },
    shortJD: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: Array,
      required: true,
    },
    minExperience: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: getValue,
    },
    maxExperience: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: getValue,
    },
    jobRole: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole', required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    employmentType: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    workMode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
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
    toJSON: { getters: true },
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobOpeningSchema.plugin(toJSON);
jobOpeningSchema.plugin(paginate);

/**
 * Check if Job opening exist
 * @param {ObjectId} [jobOpeningId] - The id of the Job Opening
 * @returns {Promise<boolean>}
 */
jobOpeningSchema.statics.isJobOpeningExists = async function (jobOpeningId) {
  const jobOpening = await this.findById(jobOpeningId);
  return jobOpening;
};

/**
 * @typedef JobOpening
 */
const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);

module.exports = JobOpening;
