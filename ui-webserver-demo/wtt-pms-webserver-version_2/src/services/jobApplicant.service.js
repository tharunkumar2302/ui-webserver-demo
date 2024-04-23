const httpStatus = require('http-status');
const { emailService } = require('.');
const { statusRights } = require('../config/jobApplicantStatus');
const { SystemRole, JobOpening, User, JobApplicant, JobRole } = require('../models');
const ApiError = require('../utils/ApiError');
const { parseTemplate, enQueueEmail } = require('./email.service');

/**
 * Get job role by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getJobApplicantById = async (id) => {
  const data = await JobApplicant.findById(id).populate('user').populate('jobApplication').populate('modifiedByUserId');
  if (!data) {
    return data;
  }
  await populateJobRole([data]);
  return data;
};

/**
 * Create a job applicant
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const createjobApplicant = async (userid, reqBody) => {
  const jobOpening = await JobOpening.isJobOpeningExists(reqBody.jobApplication);
  if (!jobOpening) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid JobOpening ID(jobApplication) Provided');
  }

  const userId = reqBody.user || userid;

  if (!(await User.isUserExists(userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID(User) Provided');
  }
  const applyuser = await User.findById(userId).populate('role');
  const appliedJob = await JobApplicant.isJobApplied(reqBody.jobApplication, userId);
  if (appliedJob && appliedJob.status !== 'withDraw') {
    if (reqBody.status === 'applied')
      throw new ApiError(
        httpStatus.FOUND,
        `${applyuser.firstName} has already applied for this Job. Application is in ${appliedJob.status} state.`
      );
  }

  if (applyuser.role.name !== 'candidate') {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      `${applyuser.role.name} can not apply for job. Only candidate can apply for job.`
    );
  }
  const user = await User.findById(userid);
  const userRole = (await SystemRole.findById(user.role)).name;
  const statusRight = statusRights.get(userRole);
  if (!statusRight.includes(reqBody.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `invalid value for status. Valid values are: [${statusRight.join(', ')}]`);
  }
  let jobApplicant = {};
  if (appliedJob) {
    if (reqBody.status === 'withDraw') {
      jobApplicant = await getJobApplicantById(appliedJob.id || appliedJob._id);
      jobApplicant.status = reqBody.status;
      await appliedJob.remove();
    } else {
      Object.assign(appliedJob, reqBody);
      jobApplicant = await appliedJob.save();
    }
  } else {
    jobApplicant = await JobApplicant.create({ ...reqBody, user: userId, organization: jobOpening.organization });
  }

  return reqBody.status === 'withDraw' ? jobApplicant : getJobApplicantById(jobApplicant.id);
};

const notfyRecruiter = async (jobApplicant, jobOpeningService) => {
  const jobOpenigDetails = await jobOpeningService.getJobOpeningById(jobApplicant.jobApplication.id);
  const { user } = jobApplicant;
  const recruiter = jobOpenigDetails.modifiedByUserId;
  const body = await parseTemplate('', 'recruiter/recruiter_notifier', '', {
    recruiterName: `${recruiter.firstName} ${recruiter.lastName}`,
    candidateName: `${user.firstName} ${user.lastName}`,
    candidateEmailAddress: user.emailAddress,
    jobTitle: jobOpenigDetails.jobRole.name,
    status: jobApplicant.status,
  });
  enQueueEmail(
    `${recruiter.emailAddress}`,
    `Candidate ${jobApplicant.status} - ${jobOpenigDetails.jobRole.name} : ${user.firstName} ${user.lastName}`,
    body
  );

  // await emailService.sendEmail(
  //   `harshit.dubey@walkingtree.tech, ${recruiter.emailAddress}`,
  //   `Candidate ${jobApplicant.status} - ${jobOpenigDetails.jobRole.name} : ${user.firstName} ${user.lastName}`,
  //   '',
  //   'recruiter/recruiter_notifier',
  //   {},
  //   {
  //     recruiterName: `${recruiter.firstName} ${recruiter.lastName}`,
  //     candidateName: `${user.firstName} ${user.lastName}`,
  //     candidateEmailAddress: user.emailAddress,
  //     jobTitle: jobOpenigDetails.jobRole.name,
  //     status:jobApplicant.status,
  //   }
  // );
};

/**
 * Query for Job Applicants
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryJobApplicants = async (filter, options) => {
  let jobApplicantData = await JobApplicant.paginate(filter, options);
  await populateJobRole(jobApplicantData.results);
  stringToHtml(['skillsRequired'], jobApplicantData['results']);
  jobApplicantData.results = JSON.parse(JSON.stringify(jobApplicantData)).results.map((data)=> {
    return {...data, applicantName: data.user?.firstName +' '+ data.user?.lastName}
  })
  return jobApplicantData;
};

const stringToHtml = (fieldsKey, dataArray) => {
  fieldsKey.forEach((key) => {
    dataArray?.length &&
      dataArray.forEach((data) => {
        data.jobApplication[key] = data.jobApplication[key]?.replaceAll('&lt;', '<');
      });
  });
};

/**
 * Populate the jobRole data in the applicant.jobapplication.jobRole
 * @param {Array} jobApplicantData - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const populateJobRole = (jobApplicantData) => {
  return Promise.all(
    jobApplicantData.map(
      (applicant) =>
        new Promise((res) => {
          if (applicant.jobApplication && applicant.jobApplication.jobRole) {
            JobRole.findById(applicant.jobApplication.jobRole).then((data) => {
              applicant.jobApplication.jobRole = data;
              res(applicant);
            });
          } else {
            res(applicant);
          }
        })
    )
  );
};

/**
 * Get user by name
 * @param {string} name
 * @returns {Promise<User>}
 */
const getRoleByName = async (name) => {
  return SystemRole.findOne({ name });
};

/**
 * Update job applicant data by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatejobApplicant = async (id, updateBody) => {
  const jobApplicant = await getJobApplicantById(id);
  if (!jobApplicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job application not found');
  }
  Object.assign(jobApplicant, updateBody);
  await jobApplicant.save();

  return getJobApplicantById(id);
};

/**
 * Delete job application by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const deleteJobApplicantById = async (id) => {
  const application = await getJobApplicantById(id);
  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, 'application not found');
  }

  await application.remove();
  return application;
};

module.exports = {
  createjobApplicant,
  queryJobApplicants,
  getJobApplicantById,
  updatejobApplicant,
  deleteJobApplicantById,
  getRoleByName,
  notfyRecruiter,
  populateJobRole,
};
