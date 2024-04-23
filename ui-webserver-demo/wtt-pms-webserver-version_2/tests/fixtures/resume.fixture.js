const mongoose = require('mongoose');
const { Resumes } = require('../../src/models');
const faker = require('faker');
const { insertOrganization, organizationThree } = require('./organization.fixture');

const resume = {
  _id: mongoose.Types.ObjectId(),
  organization: organizationThree._id,
  firstName: 'Shivam',
  lastName: 'Chaudhary',
  email: faker.internet.email().toLowerCase(),
  phone_no: '9896645672',
  current_location: 'Agra',
  current_designation: 'fake',
  marital_status: 'single',
  present_address: 'abc',
  date_of_birth: '17/03/2023',
  current_company: 'XYZ',
  // experience: mongoose.Types.Decimal128,
  education: 'bCA',
  primary_skill: ['HTML'],
  secondary_skill: 'CSS',
  education_details: ['BCA'],
  experience_details: ['2'],
  // current_ctc: mongoose.Types.Decimal128,
  current_employment_status: 'abc',
  industry: 'abc',
  notice_period: '3',
  prefered_location: 'Noida',
  ready_to_relocate: 'yes',
  overseas_experience: '2',
  having_passport: 'yes',
  passport_validity: '2',
  visa: 'no',
  // createdByUserId: mongoose.Types.ObjectId,
  // modifiedByUserId: mongoose.Types.ObjectId,
  // modifiedByUserRole: mongoose.Types.ObjectId,
  // createdByUserRole: mongoose.Types.ObjectId,
  file_path: 'xzc',
  About: 'Hello',
  isActive: true,
  source: 'ML Parse',
  status: 'applied',
};
console.log(resume.name);

const insertResume = async (data, notAddorg = false) => {
  !notAddorg && (await insertOrganization([organizationThree]));
  await Resumes.insertMany(data.map((data) => ({ ...data })));
};

module.exports = { resume, insertResume };
