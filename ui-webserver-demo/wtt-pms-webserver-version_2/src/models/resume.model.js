const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

function getValue(value) {
  if (typeof value !== 'undefined') {
    return parseFloat(value.toString());
  }
  return value;
}

const ResumeDetails = mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    firstName: { type: String, required: true, trim: true, sample: 'name' },
    lastName: { type: String, required: true, trim: true, sample: 'surname' },
    email: {
      type: String,
      required: true,
      sample: 'name@domainname.com',
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phone_no: {
      type: String,
      required: true,
      trim: true,
      // validate(value) {
      //   if (!value.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
      //     throw new Error('Invalid mobile number');
      //   }
      // },
      sample: '9867483627 (Should be an 10 digit valid phone number)',
    },
    current_location: { type: String, required: true, trim: true, sample: 'Agra, Noida' },
    is_cv_uploaded: { type: Boolean, default: false },
    current_designation: { type: String, trim: true },
    marital_status: { type: String, required: false, trim: true },
    present_address: { type: String, required: false, trim: true },
    date_of_birth: { type: String, required: false, trim: true },
    current_company: { type: String, required: false, trim: false },
    experience: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
      get: getValue,
      sample: '1',
      in: ' years',
    },
    education: { type: String, required: false, trim: true, sample: 'B.tech' },
    primary_skill: { type: Array, required: false, trim: true, sample: 'HTML,CSS' },
    secondary_skill: { type: String, required: false, trim: true, sample: 'HTML,CSS' },
    education_details: { type: Array, required: false, trim: true },
    experience_details: { type: Array, required: false, trim: true },
    current_ctc: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
      get: getValue,
      sample: '4',
      in: ' Lakh',
    },
    expected_ctc: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
      get: getValue,
      sample: '5',
      in: ' lakh',
    },
    current_employment_status: { type: String, required: false, trim: true },
    industry: { type: String, required: false, trim: true },
    notice_period: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: 0,
      sample: '3',
      in: ' months',
    },
    prefered_location: { type: String, required: false, trim: true },
    ready_to_relocate: { type: String, required: false, trim: true },
    overseas_experience: { type: String, required: false, trim: true },
    having_passport: { type: String, required: false, trim: true },
    passport_validity: { type: String, required: false, trim: true },
    visa: { type: String, required: false, trim: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    modifiedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    modifiedByUserRole: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemRole', required: false, private: true },
    createdByUserRole: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemRole', required: false, private: true },
    file_path: { type: String, required: false, trim: true },
    About: { type: String, required: false, trim: true },
    isActive: { type: Boolean, default: true },
    source: { type: String, required: true, default: 'ML Parse' },
    status: { type: String, required: true },
    candidateregistered: { type: Boolean, default: false },
    cv_url: { type: String, }
  },
  {
    toJSON: { getters: true },
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ResumeDetails.plugin(toJSON);
ResumeDetails.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} organization - organization ID
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
ResumeDetails.statics.isEmailTaken = async function (email, organization, excludeResumeId) {
  const user = organization
    ? await this.findOne({ email, organization: organization, _id: { $ne: excludeResumeId } })
    : await this.findOne({ email, _id: { $ne: excludeResumeId } });
  return !!user;
};

/**
 * @typedef Candidates
 */
const Resumes = mongoose.model('resumes', ResumeDetails);

module.exports = Resumes;
