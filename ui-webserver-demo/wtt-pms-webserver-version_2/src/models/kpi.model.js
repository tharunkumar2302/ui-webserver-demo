const mongoose = require('mongoose');
const { objectId } = require('../validations/custom.validation');
const { toJSON, paginate } = require('./plugins');

const kpiSchema = mongoose.Schema({
  organization: {
    type: String,
    required: false,
  },
  uploadSummary: {
    type: Object,
    required: true,
  },
  deActivatedResumes: {
    type: String,
    required: true,
  },
  totalResumes: {
    type: String,
    required: true,
  },
  updatedResumes: {
    type: Object,
    required: true,
  },
  notUpdatedResumes: {
    type: Object,
    required: true,
  },
});

// add plugin that converts mongoose to json
kpiSchema.plugin(toJSON);
kpiSchema.plugin(paginate);

/**
 * @typedef KPI
 */
const KPI = mongoose.model('KPI', kpiSchema);

module.exports = KPI;
