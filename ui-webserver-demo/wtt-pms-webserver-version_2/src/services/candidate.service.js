const { JobApplicant, Resumes, Organization } = require('../models');
const { tokenService, emailService, userService } = require('./index');

const sendCandidateInvite = async (result, requestBody) => {
  let element = [];
  let rData = [];
  let inviteCandidateToken;
  for (let index = 0; index < result.length; index++) {
    element.push(result[index]._id);
    inviteCandidateToken = await tokenService.generateTokenCandidateInvite(element[index], true, requestBody.user);
    rData.push({
      email: result[index].email,
    });
    await emailService.sendInviteCandidateEmail(
      result[index].email,
      inviteCandidateToken,
      result[index].name,
      requestBody.user.firstName,
      requestBody.body.endpointUrl,
    );

  }
  return rData;
};

const getCandidateDetail = async (tokenData) => {
  const resumeObj = await tokenService.getCandidateResumeDetails(tokenData);
  const organisation = await Organization.findById({ _id: resumeObj.organization });
  const obj = {
    firstName: resumeObj.firstName,
    lastName: resumeObj.lastName,
    emailAdress: resumeObj.email,
    mobileNumber: resumeObj.phone_no,
    resume: resumeObj._id,
    organisation: organisation.name,
    isActive: true,
  };
  return obj;
};

const candidateDetailsView = async (requestBody) => {
  let cvUploaded;
  let cvUploadPercent;
  const resumeId = requestBody.user.resume;
  const resumeObj = await Resumes.findOne({ _id: resumeId });
  const basic_details = [
    'firstName',
    'lastName',
    'email',
    'phone_no',
    'current_location',
    'marital_status',
    'present_address',
    'date_of_birth',
  ];
  const professional_info = [
    'current_designation',
    'experience',
    'current_ctc',
    'notice_period',
    'current_company',
    'education_details',
    'expected_ctc',
    'About',
    'prefered_location',
    'ready_to_relocate',
    'having_passport',
    'visa',
    'secondary_skill',
    'overseas_experience',
    'passport_validity',
  ];
  const experience_details = [
    'job_title',
    'company_name',
    'description',
    'location',
    'industry',
    'headline',
    'employment_type',
    'date_of_joining',
    'last_date',
  ];
  const education_details = ['qualification', 'institute', 'marks_in_percentage', 'specialization', 'year_of_passing'];
  const skillSet = ['primary_skill'];
  const basicDetailsPercentage = await candidateData(resumeObj, basic_details, 40);
  const professionalInfoPercentage = await candidateData(resumeObj, professional_info, 10);
  const experienceDetailsPercentage = await candidateArrayData(resumeObj?.experience_details, experience_details, 20);
  const educationDetailsPercentage = await candidateArrayData(resumeObj?.education_details, education_details, 10);
  const primarySkillPercentage = await candidateData(resumeObj, skillSet, 10);
console.log(resumeObj);
  if (resumeObj?.is_cv_uploaded) {
    cvUploaded = true;
    cvUploadPercent = 10;
  } else {
    cvUploaded = false;
    cvUploadPercent = 0;
  }

  appliedjobData = await jobApplicationdetails(requestBody);
  return {
    detailFilled: {
      basicDetailsPercentage: basicDetailsPercentage,
      professionalInfoPercentage: professionalInfoPercentage,
      experienceDetailsPercentage: experienceDetailsPercentage,
      educationDetailsPercentage: educationDetailsPercentage,
      primarySkillPercentage: primarySkillPercentage,
      cvUploadPercent: cvUploadPercent,
    },
    resumeUploaded: cvUploaded,
    cvUploadedDate: resumeObj?.updatedAt,
    appliedjobData: appliedjobData,
  };
};

const candidateData = async (resumeObj, detailPercentage, subPercent) => {
  let percentage = 0;
  let count = 0;
  for (let i = 0; i < detailPercentage.length; i++) {
    if(resumeObj)
    {
      if (resumeObj[detailPercentage[i]]) {
        count++;
      }
    }
  }
  percentage = (count * subPercent) / detailPercentage.length;

  return percentage;
};

const candidateArrayData = async (resumeObj, detailPercentage, subPercent) => {
  let percentage = 0;
  let count = 0;
  console.log(resumeObj);
  if (resumeObj && resumeObj.length != 0) {
    for (let i = 0; i < detailPercentage.length; i++) {

      if (resumeObj[0] && resumeObj[0][detailPercentage[i]]) {
        count++;
      }
    }
  }
  percentage = (count * subPercent) / detailPercentage.length;
  return percentage;
};
const jobApplicationdetails = async (requestBody) => {
  let jobStatus = [];
  let count = {};
  let jobApplicantData = await JobApplicant.find({ user: requestBody.user._id });

  jobApplicantData.forEach((ele) => {
    switch (ele.status) {
      case 'applied':
        jobStatus.push('applied');
        break;
      case 'proccessed':
        jobStatus.push('proccessed');
        break;
      case 'scheduled':
        jobStatus.push('scheduled');
        break;
      case 'selected':
        jobStatus.push('selected');
        break;
      case 'closed':
        jobStatus.push('closed');
        break;
      case 'withDraw':
        jobStatus.push('withDraw');
        break;

      default:
        return null;
    }
  });

  for (var i = 0; i < jobStatus.length; i++) {
    count[jobStatus[i]] = (count[jobStatus[i]] || 0) + 1;
  }
  return count;
};

module.exports = { sendCandidateInvite, getCandidateDetail, candidateDetailsView };
