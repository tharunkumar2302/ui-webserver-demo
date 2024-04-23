const { JobApplicant } = require("../../src/models");
const { insertOrganization, organizationThree } = require("./organization.fixture");
const mongoose = require("mongoose");

const jobApplicant = {
    _id: mongoose.Types.ObjectId(),
    user: "63f606b4bd4d8d331cb31cdd",
    organization: organizationThree._id,
    jobApplication: "640999f3118dac19641c2ae0",
    comments: "applied for the angular developer",
    status: "applied",
    isActive: true,
}

const insertJObApplicant = async (data, notAddorg = false) => {
    !notAddorg && (await insertOrganization([organizationThree]));
    await JobApplicant.insertMany(data.map((data) => ({ ...data })));
  };
  
  module.exports = { jobApplicant, insertJObApplicant };
  