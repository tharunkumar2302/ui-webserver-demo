const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/user.model');
const { insertOrganization, organizationThree } = require('./organization.fixture');
const { insertRole, roleThree } = require('./systemRole.fixture');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: 'Dubey',
  designation: 'admin',
  mobileNumber: '9867463526',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'recruiter',
  isActive: false,
  isEmailVerified: true,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: 'Dubey',
  designation: 'admin',
  mobileNumber: '9867463526',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'candidate',
  isActive: false,
  isEmailVerified: false,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: 'Dubey',
  designation: 'admin',
  mobileNumber: '9867463526',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isActive: false,
  isEmailVerified: false,
};
const employer = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: 'Dubey',
  designation: 'employer',
  mobileNumber: '9867463526',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'employer',
  isActive: false,
  isEmailVerified: false,
};

const recruiter = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: 'Chaudhary',
  designation: 'recruiter',
  mobileNumber: '9854678665',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'recruiter',
  isActive: false,
  isEmailVerified: false,
};

const candidate = {
  _id: mongoose.Types.ObjectId(),
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
  designation: 'candidate',
  mobileNumber: '9854678664',
  emailAddress: faker.internet.email().toLowerCase(),
  password,
  role: 'candidate',
  isActive: false,
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await insertOrganization([organizationThree]);
  let roleD = {};
  const newUsers = await Promise.all(
    users.map(async (el) => {
      const newUser = { ...el };
      const promise = new Promise((res) => {
        const rolec = { ...roleThree, _id: mongoose.Types.ObjectId() };
        if (newUser.role) {
          rolec.name = newUser.role;
        }

        insertRole([rolec]).then(() => {
          newUser.role = rolec._id;
          newUser.organization = organizationThree._id;
          roleD = rolec;
          res(newUser);
        });
      });
      return promise;
    })
  );

  await User.insertMany(newUsers.map((user) => ({ ...user, password: hashedPassword })));
  return roleD;
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
  employer,
  recruiter,
  candidate,
};
