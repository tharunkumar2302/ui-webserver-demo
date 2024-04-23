const httpStatus = require('http-status');
var aws = require('aws-sdk');
const multer = require('multer');
var multerS3 = require('multer-s3');
const path = require('path');
const { Resumes, Profile, SystemRole, KPI, User, pricingplanusageorganisation } = require('../models');
const ApiError = require('../utils/ApiError');
const { regularExpForField, makeSearchQueryForFields } = require('../utils/makeSearchQuery');
const { allOperators } = require('../config/operators');
const { exportData, excelToJosn } = require('../utils/excelFormating');
const { getPassedDateAndMidnight, lastMonth, getPreviousMonthDate } = require('../utils/helper');
const config = require('../config/config');
const resumeValidation = require('../validations/resumes.validation');
const fs = require('fs');
const validate = require('../middlewares/validate');
const { objectId } = require('../validations/custom.validation');
const { create } = require('../models/token.model');
const { createPDF } = require('../templates/profilegenerator/pdf-generator');
const { google } = require('googleapis');
const { Readable } = require('stream');
const logger = require('../config/logger');
const pricingplan = require('../models/pricingPlans.model');
const { log } = require('console');
/**
 * create fiter array for the filed with name `name` and push it in `array`.
 * @param {string} textArray - string which we have to search.
 * @param {string} name - string by which we have the filed in collection
 * @param {array} array
 * @returns {array}
 */
const regExpArrayForTextFieldSearch = (textArray, name, array) => {
  const result = textArray
    ? textArray
        .map((local) => {
          return [regularExpForField(local.toLowerCase()), regularExpForField(local.split(' ').join('').toLowerCase())];
        })
        .flat()
    : null;

  if (result && result.length > 0) {
    array.push({ [name]: { $in: result } });
  }
  return array;
};

const createResume = async (ResumeBody) => {
  if (await Resumes.isEmailTaken(ResumeBody.email, ResumeBody.organization)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const roles = await SystemRole.findById(ResumeBody.createdByUserRole);

  if(roles.name == 'recruiter') {
  const recruiterData = await User.findById(ResumeBody.createdByUserId);
  const employerData = await User.findById(recruiterData.createdByUserId);
  const plan = await pricingplan.findOne({_id: employerData.pricingPlan});
  const pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: employerData.organization,name: plan.name})));
  const filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'PROFILES_RESTRICTION');
  console.log(filteredObject,'filteredObject');
  if(filteredObject.actual >= filteredObject.value) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'limit exceeds!!');
  }
  filteredObject.actual += 1;
  let getData = (await pricingplanusageorganisation.findOne({organization: employerData.organization}));
  Object.assign(getData, pricingPlanDetail);
  await getData.save();
}
  return Resumes.create(ResumeBody);
};

const getResumeCount = async (lte, gte, role, fieldName = 'updatedAt', org) => {
  const query = {
    [fieldName]: {
      $lte: lte,
    },
  };
  if (gte) {
    query[fieldName].$gte = gte;
  }
  if (role) {
    query.modifiedByUserRole = role;
  }
  if (org) {
    query.organization = objectId(`${org}`);
  }
  return Resumes.countDocuments(query);
};

const getResumeView = async (org) => {
  const tdate = getPassedDateAndMidnight(new Date());
  const yDate = getPassedDateAndMidnight(new Date(new Date().setDate(tdate.date.getDate() - 2)));
  const weekDate = getPassedDateAndMidnight(new Date(new Date().setDate(tdate.date.getDate() - 8)));
  let monthDate = tdate.date.getDate() - 31;
  if (monthDate < 1) {
    monthDate = getPassedDateAndMidnight(
      getPreviousMonthDate(new Date().setDate(lastMonth(tdate.date.getMonth(), tdate.date.getFullYear()) + monthDate))
    );
  } else {
    monthDate = getPassedDateAndMidnight(new Date(new Date().setDate(monthDate)));
  }

  const result = {
    uploadSummary: {},
  };

  await Promise.all(
    (
      await SystemRole.find({})
    )
      .filter((role) => role.name !== 'admin' && role.name !== 'employer')
      .map(async (role) => {
        return new Promise((res) => {
          const roleId = role._id || role.id;
          Promise.all([
            getResumeCount(tdate.date, tdate.midNight, roleId, 'updatedAt', org),
            getResumeCount(yDate.date, yDate.midNight, roleId, 'updatedAt', org),
            getResumeCount(tdate.date, weekDate.midNight, roleId, 'updatedAt', org),
            getResumeCount(weekDate.midNight, monthDate.midNight, roleId, 'updatedAt', org),
          ]).then((data) => {
            result.uploadSummary[`by${role.name.replace(role.name[0], role.name[0].toUpperCase())}`] = {
              today: data[0],
              yesterday: data[1],
              week: data[2],
              month: data[3],
            };
            res(result);
          });
        });
      })
  );

  const filrObj = { isActive: false };
  if (org) {
    filrObj['organization'] = org;
  }
  result.deActivatedResumes = await Resumes.count(filrObj);

  return result;
};

const getDashBoardView = async (org) => {
  const result = {};
  const tdate = getPassedDateAndMidnight(new Date());
  const pastYear = getPassedDateAndMidnight(new Date(new Date().setFullYear(+tdate.date.getFullYear() - 2)));
  let monthDate = tdate.date.getDate() - 31;
  if (monthDate < 1) {
    monthDate = getPassedDateAndMidnight(
      getPreviousMonthDate(new Date().setDate(lastMonth(tdate.date.getMonth(), tdate.date.getFullYear()) + monthDate))
    );
  } else {
    monthDate = getPassedDateAndMidnight(new Date(new Date().setDate(monthDate)));
  }
  const filter = {};
  if (org) {
    filter['organization'] = org;
  }
  result.totalResumes = await Resumes.count(filter);
  result.updatedResumes = { inLast30Days: await getResumeCount(tdate.date, monthDate.midNight, undefined, undefined, org) };
  result.notUpdatedResumes = {
    moreThan30daysTo1Year: await getResumeCount(monthDate.date, pastYear.midNight, undefined, undefined, org),
    moreThan1Year: await getResumeCount(pastYear.midNight, undefined, undefined, undefined, org),
  };
  return result;
};

const getResumeByMultipleKeywords = (multipleKeywords, result, index = 0) => {
  let dataa = [];
  console.log(multipleKeywords,'search data 0');
  // console.log('search data 1',result,'search data 1');

  if (multipleKeywords.length === 1) {
    const query = multipleKeywords[0].toLowerCase();
    result.forEach(data => {
      let d = JSON.parse(JSON.stringify(data));
      let addData = false;

      Object.values(d).forEach(string => {
        if (typeof string === 'string' && string.toLowerCase().includes(query)) {
          addData = true;
        }
      });

      addData && dataa.push(data);
    });
  } else {
    const query = multipleKeywords[index].toLowerCase();
    result.forEach(data => {
      let d = JSON.parse(JSON.stringify(data));
      let addData = false;

      Object.values(d).forEach(string => {
        if (typeof string === 'string' && string.toLowerCase().includes(query)) {
          addData = true;
        }
      });

      addData && dataa.push(data);
    });

    if (multipleKeywords[index + 1]) {
      return getResumeByMultipleKeywords(multipleKeywords, dataa, index + 1);
    }
  }

  return dataa;
}


const getResumes = async (filterfield, options, user, query) => {

  let role = await SystemRole.findById(user.role);

  let filter = { ...filterfield };

  let orgFilter = await makeSearchQueryForFields({}, user);

  if (role.name === "superuser") {
    delete filter.organization;
    orgFilter = null;
  }

  if (orgFilter && orgFilter.organization) {
    filter['$and'] = [orgFilter];
  }

  let cvNotUpload;
  if (query.cvNotUpload === true) {
    cvNotUpload = [
      {
        is_cv_uploaded: false,
      },
    ];
    if (!filter['$or']) {
      filter['$or'] = [];
    }

    filter['$or'].push(...cvNotUpload);
  }


  let data = {};
  if (query.keyword) {
    const dataToFilter = {
      ...(await prepareFilterQuery(query.keyword.toLowerCase(), user)),
    };

    if (query.cvNotUpload === true) {
      !dataToFilter['$or'] && (dataToFilter['$or'] = []);
      dataToFilter['$or'].push(...cvNotUpload);
    }
    console.log(dataToFilter,'data key');
    data = Resumes.paginate(dataToFilter, query.export ? false : options);
  } else if (query.filters) {
    const filterFieldArray = [];
    console.log(query.filters.location,'yyy');
    regExpArrayForTextFieldSearch(query.filters.location, 'current_location', filterFieldArray);
    regExpArrayForTextFieldSearch(query.filters.education, 'education', filterFieldArray);
    regExpArrayForTextFieldSearch(query.filters.skills, 'primary_skill', filterFieldArray);
    regExpArrayForTextFieldSearch(query.filters.employmentStatus, 'current_employment_status', filterFieldArray);
    regExpArrayForTextFieldSearch(query.filters.prefferedLocation, 'prefered_location', filterFieldArray);
    addFilterQueryBasedOnOperators(query.filters.experience, 'experience', filterFieldArray);
    addFilterQueryBasedOnOperators(query.filters.ctc, 'expected_ctc', filterFieldArray);
    addFilterQueryBasedOnOperators(query.filters.noticePeriod, 'notice_period', filterFieldArray);
    let orgFilter = await makeSearchQueryForFields({}, user);

    if(role.name === "superuser") {
      delete filter.organization;
      orgFilter = null;
    }

    if (orgFilter && orgFilter.organization) {
      filterFieldArray.push(orgFilter);
    }

    const filterDataQ = {
      $and: filterFieldArray,
      ...filterfield,
    };

    if(role.name === "superuser") {
      delete filterDataQ.organization;
      orgFilter = null;
    }

    if (query.cvNotUpload === true) {
      !filterDataQ['$or'] && (filterDataQ['$or'] = []);
      filterDataQ['$or'].push(...cvNotUpload);
    }

    data = Resumes.paginate(filterDataQ, query.export ? false : options);

  } else {

    data = Resumes.paginate(filter, query.export ? false : options);

  }

  let results;
  try {
    results = await data;
  } catch (err) {
    console.log(err, 'model error');
  }

  if (query.export) {
    if (!results || !results.results || results.results.length <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No Record found to export. For the applied filter.');
    }
    // eslint-disable-next-line no-use-before-define
    return exportData(JSON.parse(JSON.stringify(results.results)), query.type, '', query.columns);
  }

  return data;
};




const getResumeById = async (id) => {
  return Resumes.findById(id);
};

const updateResumeById = async (ResumeId, updateBody,user) => {
  const updateResumeData = await getResumeById(ResumeId);
  if (!updateResumeData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume not found');
  }
  if (updateBody.isActive === null || updateBody.isActive === undefined || updateBody.isActive === '') {
    updateBody.isActive = updateResumeData.isActive;
  }
  let role = await SystemRole.findById(user.role)
  if(role.name === "superuser") {
    throw new ApiError(httpStatus.BAD_REQUEST, 'you are not having an access to edit');
  }
  Object.assign(updateResumeData, updateBody);
  await updateResumeData.save();
  return updateResumeData;
};

const deleteResumeById = async (resumeId) => {
  const resume = await getResumeById(resumeId);
  const roles = await SystemRole.findById(resume.createdByUserRole);
  if(roles.name == 'recruiter') {
    const recruiterData = await User.findById(resume.createdByUserId);
  const employerData = await User.findById(recruiterData.createdByUserId);
  const plan = await pricingplan.findOne({_id: employerData.pricingPlan});
  const pricingPlanDetail = JSON.parse(JSON.stringify(await pricingplanusageorganisation.findOne({organization: employerData.organization,name: plan.name})));
  const filteredObject = pricingPlanDetail.rules.find(rule => rule.rule_Code === 'PROFILES_RESTRICTION');
  filteredObject.actual -= 1;
  let getData = (await pricingplanusageorganisation.findOne({organization: employerData.organization}));
  Object.assign(getData, pricingPlanDetail);
  await getData.save();
  }
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume not found');
  }
  await resume.remove();
  return resume;
};

const prepareFilterQuery = async (keyword, user) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const keyvalueRegex = new RegExp(`${keyword || ''}`, 'i');
  let number = +keyword;
  number = number && number !== 0 ? undefined : number;

  const filterArr = [
    { firstName: keyvalueRegex },
    { lastName: keyvalueRegex },
    { current_location: keyvalueRegex },
    { email: keyvalueRegex },
    { phone_no: keyvalueRegex },
    { current_location: keyvalueRegex },
    { marital_status: keyvalueRegex },
    { present_address: keyvalueRegex },
    { date_of_birth: keyvalueRegex },
    { current_designation: keyvalueRegex },
    { current_company: keyvalueRegex },

    { education: keyvalueRegex },
    { primary_skill: keyvalueRegex },
    { secondary_skill: keyvalueRegex },
    { education_details: keyvalueRegex },
    { experience_details: keyvalueRegex },

    { current_employment_status: keyvalueRegex },
    { industry: keyvalueRegex },

    { prefered_location: keyvalueRegex },
    { ready_to_relocate: keyvalueRegex },
    { overseas_experience: keyvalueRegex },
    { having_passport: keyvalueRegex },
    { passport_validity: keyvalueRegex },
    { visa: keyvalueRegex },
    { created_by: keyvalueRegex },
    { uploaded_by: keyvalueRegex },
  ];
  if (number) {
    filterArr.push(
      ...[{ experience: keyword }, { current_ctc: keyword }, { expected_ctc: keyword }, { notice_period: keyword }]
    );
  }
  const query = {
    $or: filterArr,
  };
  // const role = await SystemRole.findById(user.role);
  const orgFilter = await makeSearchQueryForFields({}, user);
  let role = await SystemRole.findById(user.role);
  if (orgFilter && orgFilter.organization && role.name != "superuser") {
  if (orgFilter && orgFilter.organization && role.name != "superuser") {
    query['$and'] = [orgFilter];
  }
};
return query;
}

const getResumesbyKeyword = async (keyword, options, user) => {
  const query = await prepareFilterQuery(keyword, user);
  const resumes = await Resumes.paginate(query, options);
  return resumes;
};

/**
 * create fiter object for the filed with name `name` and push it in `array`.
 * @param {object} object - object which contains number and operator.
 * @param {string} name - string by which we have the filed in collection
 * @param {array} array
 * @returns {array}
 */
const addFilterQueryBasedOnOperators = (object, name, array) => {
  if (object && (object.number || object.number === 0))
    array.push({ [name]: { [`$${allOperators[object.operator]}`]: object.number } });
  return array;
};

/**
 * filter the resumes based on the provide filter query
 * @param {object} body
 * @param {Object} options
 * @returns {Promise<Resumes[]>}
 */
const getFilteredSearchData = async (body, options, user) => {
  let filter = {};
  const orgFilter = await makeSearchQueryForFields({}, user);
  if (orgFilter && orgFilter.organization) {
    filter['$and'] = [orgFilter];
  }
  let cvNotUpload;
  if (body.cvNotUpload === true) {
    cvNotUpload = [
      {
        is_cv_uploaded: false,
      },
      // {
      //   file_path: { $eq: '' },
      // },
      // { file_path: { $eq: null } },
      // { file_path: { $eq: undefined } },
    ];
    if (!filter['$or']) {
      filter['$or'] = [];
    }

    filter['$or'].push(...cvNotUpload);
  }
  let data = {};
  if (body.keyword) {
    const dataToFilter = {
      ...(await prepareFilterQuery(body.keyword, user)),
    };
    if (body.cvNotUpload === true) {
      !dataToFilter['$or'] && (dataToFilter['$or'] = []);
      dataToFilter['$or'].push(...cvNotUpload);
      // filterFieldArray.push();
    }
    data = Resumes.paginate(dataToFilter, body.export ? false : options);
  } else if (body.filters) {
    const filterFieldArray = [];
    regExpArrayForTextFieldSearch(body.filters.location, 'current_location', filterFieldArray);
    regExpArrayForTextFieldSearch(body.filters.education, 'education', filterFieldArray);
    regExpArrayForTextFieldSearch(body.filters.skills, 'primary_skill', filterFieldArray);
    regExpArrayForTextFieldSearch(body.filters.employmentStatus, 'current_employment_status', filterFieldArray);
    regExpArrayForTextFieldSearch(body.filters.prefferedLocation, 'prefered_location', filterFieldArray);
    addFilterQueryBasedOnOperators(body.filters.experience, 'experience', filterFieldArray);
    addFilterQueryBasedOnOperators(body.filters.ctc, 'expected_ctc', filterFieldArray);
    // addFilterQueryBasedOnOperators(body.filters.expected_ctc, 'expected_ctc', filterFieldArray);
    addFilterQueryBasedOnOperators(body.filters.noticePeriod, 'notice_period', filterFieldArray);
    const orgFilter = await makeSearchQueryForFields({}, user);
    if (orgFilter && orgFilter.organization) {
      filterFieldArray.push(orgFilter);
    }
    const filterDataQ = {
      $and: filterFieldArray,
    };
    if (body.cvNotUpload === true) {
      !filterDataQ['$or'] && (filterDataQ['$or'] = []);
      filterDataQ['$or'].push(...cvNotUpload);
    }
    data = Resumes.paginate(filterDataQ, body.export ? false : options);
  } else {
    data = Resumes.paginate(filter, body.export ? false : options);
  }
  const results = await data;

  if (body.export) {
    if (results.results.length <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No Record found to export. For the applied filter.');
    }
    // eslint-disable-next-line no-use-before-define
    return exportData(JSON.parse(JSON.stringify(results.results)), body.type, '', body.columns);
  }
  return data;
};

const updateResumeView = async (user) => {
  const org = await makeSearchQueryForFields({}, user);
  let result = {};
  let kpi = {};
  if (org.organization) {
    result = {
      ...(await getResumeView(org.organization)),
      ...(await getDashBoardView(org.organization)),
      organization: org.organization,
    };
    kpi = await KPI.findOne({ organization: org.organization });
  } else {
    result = {
      ...(await getResumeView()),
      ...(await getDashBoardView()),
    };
    kpi = await KPI.findOne({ organization: null });
  }

  if (kpi) {
    Object.assign(kpi, result);

    await kpi.save();
  } else {
    kpi = await KPI.create(result);
  }
  return kpi;
};

//  S3 bucket  config
const s3 = new aws.S3({
  accessKeyId: config.AWSconfig.accesskey,
  secretAccessKey: config.AWSconfig.secretAccesskey,
  region: config.AWSconfig.region,
  Bucket: config.AWSconfig.s3bucket,
});
//AWS s3 storage
var uploads3Storage = multerS3({
  s3: s3,
  limits: {
    fileSize: 5000000,
    fieldSize: 200 * 1024 * 1024,
  },
  bucket: `${config.AWSconfig.s3bucket}/${config.AWSconfig.s3folder}`,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const extension = path.parse(file.originalname).ext;
    if (extension != '.pdf' && extension != '.doc' && extension != '.docx' && extension != '.xlsx') {
      cb(new ApiError(httpStatus.BAD_REQUEST, 'Invalid file format'));
      return;
    }
    cb(null, `${path.parse(file.originalname).name}_${Date.now()}${path.parse(file.originalname).ext}`);
  },
});
const privateKey = config.GoogleDriveconfig.private_key.replace(/\\n/g, '\n');
const credentials = {
  private_key: privateKey,
  client_email: config.GoogleDriveconfig.client_email,
};
const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});
const uploadToDrive = async (fileName, filePath,currentUser) => {
  // get file from S3 and upload to Drive
  console.log(currentUser,'user');
  const role = await SystemRole.findById(currentUser.role);
  if(role.name === "candidate"){
  const currentUserResume = JSON.parse(JSON.stringify(await Resumes.findById(currentUser.resume)));
  currentUserResume.file_path = filePath ? filePath : "";
  let getData = (await Resumes.findById(currentUser.resume));
      Object.assign(getData, currentUserResume);
      getData.save();
  }
  try {
    const s3Object = await s3
      .getObject({
        Bucket: `${config.AWSconfig.s3bucket}`,
        Key: filePath,
      })
      .promise();
    const fileMetadata = {
      name: fileName,
      parents: [config.GoogleDriveconfig.GoogleDrive_Folder_Id],
    };
    const media = {
      mimeType: s3Object.mimetype,
      //body: fs.createReadStream(s3Object.Body)
      body: new Readable({
        read() {
          this.push(s3Object.Body);
          this.push(null);
        },
      }),
    };
    const { data } = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });
    logger.info('File uploaded to google drive successfully!');
    // logger.info(`Uploaded to Google Drive: ${data.webViewLink}`);
    var link = `${data.webViewLink}`;
    return link;
  } catch (error) {
    logger.info('Error uploading file to Google Drive:', error);
    return 'Failed to upload file to google drive';
  }
};

const downloadProfile = async(fileId,filePath) => {
  console.log(filePath.split('/').splice(-1));
  const path = `./${filePath.split('/').splice(-1)[0]}`;
  const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  const destStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    response.data
      .on('end', () => {
        console.log('File downloaded successfully.');
        resolve(path);
      })
      .on('error', (err) => {
        console.error('Error downloading file:', err);
        reject(err);
      }).pipe(destStream);
  });
}

const uploadExcelFile = async(file,currentUser) => {
  var uploads3 = multer({
    storage: uploads3Storage,
  }).array('resumes', 1000);
  uploads3(file,currentUser,async(err) => {
    // console.log(file.files,'file', ee1);
    var profiles = [];
    if(!err) {
      file.files.forEach(async (fileData) => {
        const fileName = fileData.originalname;
        const fileLocation = fileData.bucket + '/' + fileData.key;
        var filePath = fileLocation.replace(`${config.AWSconfig.s3bucket}/`, '')
        var cvlink = null;
        if (JSON.parse(config.GoogleDriveconfig.Upload_Profiles_To_GoogleDrive)) {
          const uploadDrive = await uploadToDrive(fileName, filePath,currentUser);
          cvlink = uploadDrive;
        }
        else {
          logger.info('File is not moved to google drive as global setting is false');
        }
        var ProfileQueue;
        ProfileQueue = await Profile.create({
          organization: currentUser.organization,
          uploadedBy: currentUser._id,
          file_path: filePath,
          cv_url: cvlink,
        });
        profiles.push(ProfileQueue);
      })
    }
  })
}

const profileUpload = async (resumes, currentUser, callback) => {
  try {

    {
      var uploads3 = multer({
        storage: uploads3Storage,
      }).array('resumefiles', 1000);
      uploads3(resumes, currentUser, async (err1) => {
        if (!err1) {
          var profiles = [];
          for (i = 0; i < resumes.files.length; i++) {
            var filelocation = resumes.files[i].bucket + '/' + resumes.files[i].key;
            var filepath = filelocation.replace(`${config.AWSconfig.s3bucket}/`, '');
            const fileName = resumes.files[i].originalname;
            var cvlink = null;
            if (JSON.parse(config.GoogleDriveconfig.Upload_Profiles_To_GoogleDrive)) {
              const driveupload = await uploadToDrive(fileName, filepath,currentUser);
              cvlink = driveupload;
              console.log(cvlink);
            } else {
              // cvlink = 'File is not moved to google drive as global setting is false';
              logger.info('File is not moved to google drive as global setting is false');
            }
            var ProfileQueue;
            ProfileQueue = await Profile.create({
              organization: currentUser.organization,
              uploadedBy: currentUser._id,
              file_path: filepath,
              cv_url: cvlink,
            });
            profiles.push(ProfileQueue);
          }
          callback(0, profiles);
        } else {
          callback(err1, 0);
        }
      });
    }
  } catch (e) {
    callback(e, 0);
  }
};
const validationResumesArray = async (resumesJson) => {
  const validationFunction = validate(resumeValidation.importResumes);
  let errors = '';
  const data = await Promise.all(
    resumesJson.map((resume, i) => {
      // eslint-disable-next-line no-param-reassign
      resume.status = 'Published';
      return new Promise((resolve) => {
        validationFunction({ body: resume }, {}, async (error) => {
          if (await Resumes.isEmailTaken(resume.email, resume.organization)) {
            errors += `Error on adding ${resume.email} resume at row ${i + 1} :  Email id already taken. \n`;
          }
          if (error) {
            errors += `Error on adding ${resume.email} resume at row ${i + 1} :  ${error.message}. \n`;
          }
          resolve(resume);
        });
      });
    })
  );
  if (Object.keys(errors).length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors);
  }
  return data;
};

const importResumes = async (resums, user) => {
  const json = await validationResumesArray(await excelToJosn(resums, user));

  const result = await Promise.all(
    json.map((resume) => {
      const data = {
        ...resume,
      };
      return new Promise((resolve) => {
        Resumes.create(data).then((created) => {
          Resumes.findById(created._id || created.id)
            .populate('organization')
            .populate('createdByUserId')
            .populate('modifiedByUserId')
            .then((resumeCreated) => {
              resolve(resumeCreated);
            });
        });
      });
    })
  );

  return result;
};

const exportResumes = async (ids, columns) => {
  if (ids.length <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No resume id is provided.');
  }

  let resumsData = JSON.parse(
    JSON.stringify(
      await Resumes.find({ _id: { $in: ids } })
        .populate('organization')
        .populate('modifiedByUserId')
        .populate('createdByUserId')
    )
  );

  resumsData = resumsData.map((resume) => {
    const resmueD = {
      ...resume,
      organization: resume.organization.name,
      modifiedByUserId: `${resume.modifiedByUserId?.firstName} ${resume.modifiedByUserId?.lastName}`,
      createdByUserId: `${resume.createdByUserId?.firstName} ${resume.createdByUserId?.lastName}`,
    };

    Object.keys(resmueD).forEach((key) => {
      if (toString.call(resmueD[key]).slice(8, -1) === 'Array') {
        resmueD[key] = resmueD[key].join(',');
      }
    });
    return resmueD;
  });

  if (resumsData.length <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Record found to export. For the given ids.');
  }
  return exportData(resumsData, 'excel', '', columns);
};
const downloadResumeById = async (resumeDetails, callback) => {
  try {
    var pdfBuffer = await createPDF(resumeDetails);
    callback(0, pdfBuffer);
  } catch (e) {
    callback(e, 0);
  }
};
module.exports = {
  createResume,
  getResumes,
  getResumeById,
  updateResumeById,
  deleteResumeById,
  getResumesbyKeyword,
  downloadResumeById,
  getFilteredSearchData,
  getResumeView,
  getDashBoardView,
  updateResumeView,
  importResumes,
  profileUpload,
  exportResumes,
  regExpArrayForTextFieldSearch,
  addFilterQueryBasedOnOperators,
  getResumeByMultipleKeywords,
  downloadProfile,
  uploadExcelFile
};
