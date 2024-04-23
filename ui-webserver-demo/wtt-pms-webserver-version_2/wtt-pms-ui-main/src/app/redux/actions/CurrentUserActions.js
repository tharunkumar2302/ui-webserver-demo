import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_CURRENTUSER_DETAILS = 'GET_CURRENTUSER_DETAILS';
export const PATCH_CURRENTUSER_DETAILS = 'PATCH_CURRENTUSER_DETAILS';
export const PATCH_CANDIDATEUSER_DETAILS = 'PATCH_CANDIDATEUSER_DETAILS';
export const GET_USERPOFILE_DETAILS = 'GET_USERPOFILE_DETAILS';


export const getCurrentUserDetails = async () => {
  const res = await requestClient.get(API.CURRENTUSER_API)
  return ({
    type: GET_CURRENTUSER_DETAILS,
    payload: res.data,
  });
};

export const getUserProfileDetails = async (resumeId) => {
  const res = await requestClient.get(`${API.PROFILE_API}/${resumeId}`)
  return ({
    type: GET_USERPOFILE_DETAILS,
    payload: res.data,
  });
};

export const patchCurrentUserDetails = async (firstName, lastName, designation, mobileNumber, emailAddress) => {
  const payLoad = { firstName, lastName, designation, mobileNumber, emailAddress };
  const res = await requestClient.patch(API.CURRENTUSER_API, payLoad)
  return ({
    type: PATCH_CURRENTUSER_DETAILS,
    payload: res,
  });
};

export const patchCandidateUserDetails = async (firstName, lastName, email, phone_no, current_location, marital_status, present_address, date_of_birth, current_designation, current_company, experience, education, primary_skill, secondary_skill, education_details, experience_details, current_ctc, expected_ctc, current_employment_status, industry, notice_period, prefered_location, ready_to_relocate, overseas_experience, having_passport, passport_validity, visa, created_by, uploaded_by, About, status) => {
  const payLoad = { firstName, lastName, email, phone_no, current_location, marital_status, present_address, date_of_birth, current_designation, current_company, experience, education, primary_skill, secondary_skill, education_details, experience_details, current_ctc, expected_ctc, current_employment_status, industry, notice_period, prefered_location, ready_to_relocate, overseas_experience, having_passport, passport_validity, visa, created_by, uploaded_by, About, status };
  const res = await requestClient.patch(`${API.PROFILE_API}/currentuser`, payLoad)
  return ({
    type: PATCH_CANDIDATEUSER_DETAILS,
    payload: res,
  });
};