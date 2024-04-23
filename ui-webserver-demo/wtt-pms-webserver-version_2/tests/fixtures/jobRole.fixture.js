const mongoose = require("mongoose");
const { JobRole } = require("../../src/models");
const { insertOrganization, organizationThree } = require("./organization.fixture");

const jobRole = {
    _id: mongoose.Types.ObjectId(),
    name: "Automation Engineer",
    description: "Take care the automation part",
    organization: mongoose.Types.ObjectId(),
    isActive: true,
    createdByUserId: '63e4f686548fa41ea8beb08d',
    modifiedByUserId: '63e4f686548fa41ea8beb08d'
}

const insertJobRole = async (data, notAddorg = false) => {
    !notAddorg && (await insertOrganization([organizationThree]));
    await JobRole.insertMany(data.map((data) => ({ ...data })));
  };
  
  module.exports = { jobRole, insertJobRole };