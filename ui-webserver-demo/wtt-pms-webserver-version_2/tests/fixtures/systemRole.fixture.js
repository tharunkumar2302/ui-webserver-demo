const mongoose = require('mongoose');
const { SystemRole } = require('../../src/models');

const roleOne = {
  _id: mongoose.Types.ObjectId(),
  isDefault: true,
  isActive: false,
  name: 'admin',
  description:
    'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};
const roleThree = {
  _id: mongoose.Types.ObjectId(),
  isDefault: true,
  isActive: false,
  name: 'admin',
  description:
    'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};
const role4 = {
  _id: mongoose.Types.ObjectId(),
  isDefault: true,
  isActive: false,
  name: 'employer',
  description:
    'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};
const roleTwo = {
  _id: mongoose.Types.ObjectId(),
  isDefault: false,
  isActive: false,
  name: 'candidate',
  description:
    'Candidate is a job seeker who has been pre-qualified for a specific position or category of jobs and has been through the application process.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};

const roleFive = {
  _id: mongoose.Types.ObjectId(),
  isDefault: false,
  isActive: false,
  name: 'recruiter',
  description:
    'Candidate is a job seeker who has been pre-qualified for a specific position or category of jobs and has been through the application process.',
  modifiedByUserId: '63e4f686548fa41ea8beb08d',
  createdByUserId: '63e4f686548fa41ea8beb08d',
};

const insertRole = async (sysRoles) => {
  await SystemRole.insertMany(sysRoles.map((role) => ({ ...role })));
};

module.exports = {
  roleOne,
  roleTwo,
  roleThree,
  insertRole,
  role4,
  roleFive,
};
