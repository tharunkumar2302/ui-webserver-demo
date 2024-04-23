const { JobOpening } = require("../../src/models");
const { insertOrganization, organizationThree } = require("./organization.fixture");
const mongoose = require('mongoose');

const jobOpening = {
    _id: mongoose.Types.ObjectId(),
    department: "Testing",
    industryType: "IT",
    responsibilities: "Web Testing",
    skillsRequired: "Automation",
    description: "test application",
    qualification: "B.tech",
    organization: mongoose.Types.ObjectId(),
    location: "Agra",
    minExperience: 2,
    maxExperience: 5,
    jobRole: mongoose.Types.ObjectId(),
    isActive: true,
    employmentType: "full time",
    duration: "2 months",
    workMode: "work from office",
    status: "Draft",
    tags: ['Html','css'],
    createdByUserId: '63e4f686548fa41ea8beb08d',
    modifiedByUserId: '63e4f686548fa41ea8beb08d'
};

const insertJobOpening = async (data, notAddorg = false) => {
    !notAddorg && (await insertOrganization([organizationThree]));
    await JobOpening.insertMany(data.map((data) => ({ ...data })));
  };
  
  module.exports = { jobOpening, insertJobOpening };