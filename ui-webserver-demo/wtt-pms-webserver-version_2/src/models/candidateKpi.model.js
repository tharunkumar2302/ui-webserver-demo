const { mongoose } = require('mongoose');

const candidateKpiSchema = mongoose.Schema({
  profilePercentage: {
    type: Number,
    required: true,
  },
  cvUploaded: {
    type: Boolean,
    required: true,
  },
  appliedJobs: {
    type: object,
    required: true,
  },
});

// add plugin that converts mongoose to json
kpiSchema.plugin(toJSON);
kpiSchema.plugin(paginate);

/**
 * @typedef CANDIDATEKPI
 */
const CANDIDATEKPI = mongoose.model('CANDIDATEKPI', candidateKpiSchema);

module.exports = CANDIDATEKPI;
