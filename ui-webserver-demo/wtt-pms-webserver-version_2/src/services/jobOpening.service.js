const httpStatus = require('http-status');
const { resumeService } = require('./index');
const { SystemRole, JobRole, JobOpening, Resumes, JobApplicant } = require('../models');
const ApiError = require('../utils/ApiError');
const { regularExpForField, makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { allOperators } = require('../config/operators');
const { populateJobRole } = require('./jobApplicant.service');
const { log } = require('../config/logger');

/**
 * Create a job opening
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const createJobOpening = async (req) => {
  const reqBody = { ...req };
  const { tags } = reqBody;
  const tagsArray = tags.map((tag) => tag.toLowerCase());
  reqBody.tags = tagsArray;
  if (!(await JobRole.isRoleExistsById(reqBody.jobRole))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid Job Role!. Valid values are :${(await JobRole.find({})).map((role) => role.name).join(', ')}`
    );
  }
  const jobOpening = await JobOpening.create(reqBody);
  return JobOpening.findById(jobOpening._id || jobOpening.id)
    .populate('organization')
    .populate('jobRole');
};

/**
 * Query for jobOpenings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryJobOpenings = async (filter, options) => {
  const jobOpeningData = await JobOpening.paginate(filter, options);
  stringToHtml(['description','responsibilities','skillsRequired','secondarySkills','shortJD'], jobOpeningData.results);
  return jobOpeningData;
};

const stringToHtml = (fieldsKey, dataArray) => {
  fieldsKey.forEach((key) => {
    dataArray?.length &&dataArray.forEach((data) => {
      if(data && data[key])
      data[key] = data[key]?.replaceAll('&lt;', '<');
    });
  });
};

/**
 * Get job JobOpening by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getJobOpeningById = async (id,queryValue) => {
  if(queryValue) {
    await JobOpening.updateOne({_id: id},{$set: {isGenerateQA: queryValue}});
  } else {
    await JobOpening.updateOne({_id: id},{$set: {isGenerateQA: false}});
  }
  const data = await JobOpening.findById(id)
  .populate('organization')
  .populate('jobRole')
  .populate('createdByUserId')
  .populate('modifiedByUserId');
  stringToHtml(['description','responsibilities','skillsRequired','secondarySkills','shortJD'], [data]);

  return data
};
const JobAppliedNumber = async (jobId) => {
  const data = await JobApplicant.find({ jobApplication: jobId })
    .populate('user')
    .populate('jobApplication')
    .populate('modifiedByUserId');
  await populateJobRole(data);
  stringToHtml(['description','responsibilities','skillsRequired'], data);
  return data;
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
 * Update role by id
 * @param {ObjectId} jobOpeningId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateJobOpeningById = async (jobOpeningId, body) => {
  const updateBody = { ...body };
  const { tags } = updateBody;
  const tagsArray = tags && tags.map((tag) => tag.toLowerCase());
  if (tagsArray) updateBody.tags = tagsArray;
  const jobOpening = await getJobOpeningById(jobOpeningId);
  if (!jobOpening) {
    throw new ApiError(httpStatus.NOT_FOUND, 'job Opening not found');
  }
  if (updateBody.jobRole && !(await JobRole.isRoleExistsById(updateBody.jobRole))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid Job Role!. Valid values are :${(await JobRole.find({})).map((jrole) => jrole.name).join(', ')}`
    );
  }
  Object.assign(jobOpening, updateBody);
  await jobOpening.save();

  return getJobOpeningById(jobOpeningId);
};

/**
 * Delete Job Opening by id
 * @param {ObjectId} jobOpeningId
 * @returns {Promise<User>}
 */
const deleteRoleById = async (jobOpeningId) => {
  const jobOpening = await getJobOpeningById(jobOpeningId);
  if (!jobOpening) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job Opening not found');
  }

  await jobOpening.remove();
  return jobOpening;
};

/**
 * filter jobs by resumeid
 * @param {ObjectId} resumeId
 * @returns {Promise<User>}
 */

const filterJobsByCandidateskills = async (resumeId, optionss) => {
  console.log('tttt');

  const options = { ...optionss };
  const keyvalue = options.keyword;
  // eslint-disable-next-line security/detect-non-literal-regexp
  const keyvalueRegex = new RegExp(`${options.keyword || ''}`, 'i');
  const keywordsearch = [
    { department: keyvalueRegex },
    { industryType: keyvalueRegex },
    { responsibilitie: keyvalueRegex },
    { skillsRequired: keyvalueRegex },
    { description: keyvalueRegex },
    { qualification: keyvalueRegex },
    { location: keyvalueRegex },
    { minExperience: +keyvalue },
    { maxExperience: +keyvalue },
    { employmentType: keyvalueRegex },
    { duration: keyvalueRegex },
    { workMode: keyvalueRegex },
    { status: keyvalueRegex },
    { tags: keyvalueRegex },
    { 'jobRole.name': keyvalueRegex },
  ];

  const keywordsearchquery = {
    $or: keywordsearch,
  };
  const candidateSkills = await Resumes.findOne(resumeId);
  const Skills = candidateSkills.primary_skill;
  const SkillsregexArray = [];
  Skills.forEach((skill) => {
    const Skillsregex = regularExpForField(skill);
    SkillsregexArray.push(Skillsregex);
  });

  const convertSkills = Skills.map((Skill) => Skill.toLowerCase());
  const query = {
    tags: { $in: SkillsregexArray },
  };
  if (options.limit === undefined) {
    options.limit = 10;
  }
  if (options.page === undefined) {
    options.page = 1;
  }
  const relevantJobs = await JobOpening.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'jobroles',
        localField: 'jobRole',
        foreignField: '_id',
        as: 'jobRole',
      },
    },
    { $match: { status: 'Published' } },
    { $match: keywordsearchquery },
    {
      $project: {
        jobRole: 1,
        department: 1,
        industryType: 1,
        responsibilities: 1,
        skillsRequired: 1,
        description: 1,
        qualification: 1,
        location: 1,
        minExperience: 1,
        maxExperience: 1,
        employmentType: 1,
        duration: 1,
        workMode: 1,
        status: 1,
        tags: 1,
        order: {
          $size: {
            $setIntersection: [convertSkills, '$tags'],
          },
        },
      },
    },
    { $sort: { order: -1 } },
    {
      $facet: {
        metadata: [{ $count: 'total Relevantjobs' }, { $addFields: { page: Number(options.page) } }],
        data: [{ $skip: (Number(options.page) - 1) * Number(options.limit) }, { $limit: Number(options.limit) }], // add projection here wish you re-shape the docs
      },
    },
  ]);
    stringToHtml(['description','responsibilities','skillsRequired'],  relevantJobs[0].data);
  return relevantJobs;
};

const addFilterQueryBasedOnOperatorsAndNumber = async (object, name, name1, array) => {
  if (object && (object.number || object.number === 0)) {
    if (object.operator == 'equal') {
      array.push({ [name1]: { [`$gte`]: object.number } });
      array.push({ [name]: { [`$lte`]: object.number } });
    } else {
      const opt = allOperators[object.operator];
      array.push({ [opt == allOperators.greaterThan ? name1 : name]: { [`$${opt}`]: object.number } });
    }
  }
  return array;
};

const getJobOpeningDetail = async (body, options, user, resumeId) => {
  let filter = {};
  const orgFilter = await makeSearchQueryForFields({}, user);
  if (orgFilter && orgFilter.organization) {
    filter['$and'] = [orgFilter];
  }

  let data = {};
  let query;
  if (body.showRelvantJobs == 'true') {
    const candidateSkills = await Resumes.findOne(resumeId);
    const Skills = candidateSkills.primary_skill;
    const SkillsregexArray = Skills.map(skill => regularExpForField(escapeRegExp(skill)));
    query = [
      {
        tags: { $in: SkillsregexArray },
      },
      {
        skillsRequired: { $in: SkillsregexArray },
      },
    ];
  }
  if (body.keyword) {
    const dataToFilter = {
      $and: [await prepareFilterQuery(body.keyword, user)],
      $or: [],
    };
    if (!dataToFilter['$and'].length) delete dataToFilter['$and'];
    if (query) dataToFilter['$or'].push(...query);
    if (body.showRelvantJobs == 'true' && user.role == "63f6016aea5b8d28c8abb31c") dataToFilter['$and'].push({ status: "Published" });
    if (!dataToFilter['$or'].length) delete dataToFilter['$or'];

    data = JobOpening.paginate(dataToFilter, options);
  } else if (body.filters) {
    const filterFieldArray = [];
    resumeService.regExpArrayForTextFieldSearch(body.filters.location, 'location', filterFieldArray);
    resumeService.regExpArrayForTextFieldSearch(body.filters.jobRole, 'jobRole', filterFieldArray);
    resumeService.regExpArrayForTextFieldSearch(body.filters.company, 'organization', filterFieldArray);
    resumeService.regExpArrayForTextFieldSearch(body.filters.education, 'qualification', filterFieldArray);
    addFilterQueryBasedOnOperatorsAndNumber(body.filters.experience, 'minExperience', 'maxExperience', filterFieldArray);
    // resumeService.addFilterQueryBasedOnOperators(body.filters.ctc, 'current_ctc', filterFieldArray);
    resumeService.regExpArrayForTextFieldSearch(body.filters.jobType, 'workMode', filterFieldArray);
    resumeService.regExpArrayForTextFieldSearch(body.filters.industry, 'industryType', filterFieldArray);
    const orgFilter = await makeSearchQueryForFields({}, user);
    if (orgFilter && orgFilter.organization) {
      filterFieldArray.push(orgFilter);
    }
    if (body.showRelvantJobs == 'true' && user.role == "63f6016aea5b8d28c8abb31c") {
      filterFieldArray.push({ status: "Published" });
    }

    const dataToFilter = {
      $and: filterFieldArray,
      $or: [],
    };

    !filterFieldArray.length && delete dataToFilter['$and'];

    if (query) dataToFilter['$or'].push(...query);

    data = JobOpening.paginate(dataToFilter, options);
  } else {
    const dataToFilter = {
    };
    if (body.showRelvantJobs == 'true' && user.role == "63f6016aea5b8d28c8abb31c") {
      dataToFilter['$and'] = [{ status: "Published" }];
    }
    dataToFilter['$or'] = [];
    if (Object.keys(filter).length) {
      dataToFilter['$or'].push(filter);
    }
    if (query) dataToFilter['$or'].push(...query);
    data = JobOpening.paginate(dataToFilter, options);
  }

  const result = await data;
  stringToHtml(['description', 'responsibilities', 'skillsRequired'], result['results']);
  return result;
};

// Function to escape special characters in a string
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const prepareFilterQuery = async (keyword, user) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const keyvalueRegex = new RegExp(`${keyword || ''}`, 'i');
  let number = +keyword;
  number = number && number !== 0 ? undefined : number;

  const filterArr = [
    {
      department: keyvalueRegex,
    },
    {
      industryType: keyvalueRegex,
    },
    {
      responsibilities: keyvalueRegex,
    },
    {
      skillsRequired: keyvalueRegex,
    },
    {
      description: keyvalueRegex,
    },
    {
      qualification: keyvalueRegex,
    },
    {
      location: keyvalueRegex,
    },
    {
      duration: keyvalueRegex,
    },
    {
      workMode: keyvalueRegex,
    },
    {
      status: keyvalueRegex,
    },
    {
      tags: keyvalueRegex,
    },
    {
      createdByUserId: keyvalueRegex,
    },
    {
      modifiedByUserId: keyvalueRegex,
    },
  ];
  if (number) {
    filterArr.push(...[{ minExperience: keyword }, { maxExperience: keyword }, { duration: keyword }]);
  }
  const query = {
    $or: filterArr,
  };
  const orgFilter = await makeSearchQueryForFields({}, user);
  if (orgFilter && orgFilter.organization) {
    query['$and'] = [orgFilter];
  }
  return query;
};

module.exports = {
  createJobOpening,
  queryJobOpenings,
  getJobOpeningById,
  updateJobOpeningById,
  deleteRoleById,
  getRoleByName,
  filterJobsByCandidateskills,
  getJobOpeningDetail,
  JobAppliedNumber,
};
