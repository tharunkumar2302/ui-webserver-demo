const mongoose = require('mongoose');
const { Organization } = require('../../src/models');

const organizationOne = {
  _id: mongoose.Types.ObjectId(),
  isDefault: true,
  isActive: false,
  name: 'WTT',
  description:
    'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};
const organizationThree = {
  _id: mongoose.Types.ObjectId(),
  isDefault: true,
  isActive: false,
  name: 'WTTAdmin',
  description:
    'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};
const organizationTwo = {
  _id: mongoose.Types.ObjectId(),
  isDefault: false,
  isActive: false,
  name: 'Google',
  description:
    'Candidate is a job seeker who has been pre-qualified for a specific position or category of jobs and has been through the application process.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};

const insertOrganization = async (orgs) => {
  await Organization.insertMany(orgs.map((org) => ({ ...org })));
};

module.exports = {
  organizationOne,
  organizationTwo,
  organizationThree,
  insertOrganization,
};
