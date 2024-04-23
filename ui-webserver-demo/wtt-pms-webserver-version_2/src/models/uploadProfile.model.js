const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ProfileSchema = mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false },
    file_path: { type: String, required: true, trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    isProcessed: { type: Boolean, default: false },
    processedDateTime: { type: Date, required: false, trim: true, default: '' },
    Remarks: { type: String, required: false, default: '' },
    isError: { type: Boolean, default: false },
    errorMessage: { type: String, required: false, default: '' },
    isDuplicate: { type: Boolean, default: false },
    cv_url: {type: String, required: false, trim: true, default: ''}
  },
  {
    toJSON: { getters: true },
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ProfileSchema.plugin(toJSON);

/**
 * @typedef Profile
 */
const Profile = mongoose.model('ProfileQueue', ProfileSchema);

module.exports = Profile;
