import requestClient from '../../apiManager/interceptors'
import API from 'app/apiManager/endpoints';
import {apiLimit50000 } from 'app/utils/constant';
export const GET_PROFILE_DETAILS = 'GET_PROFILE_DETAILS';
export const GET_PROFILE_SEARCH_DETAILS = 'GET_PROFILE_SEARCH_DETAILS';
export const GET_EXPORT_TEMPLATE_DETAILS = 'GET_EXPORT_TEMPLATE_DETAILS';
export const GET_PROFILE_CV_DOWNLOAD = 'GET_PROFILE_CV_DOWNLOAD';
export const POST_PROFILE_DETAILS = 'POST_PROFILE_DETAILS';
export const POST_PROFILE_SEARCH_DETAILS = 'POST_PROFILE_SEARCH_DETAILS';
export const POST_PROFILE_EXPORTALL_DETAILS = 'POST_PROFILE_EXPORTALL_DETAILS';
export const POST_PROFILE_IMPORT_DETAILS = 'POST_PROFILE_IMPORT_DETAILS';
export const POST_UPLOAD_S3_DETAILS = 'POST_UPLOAD_S3_DETAILS';
export const POST_PROFILE_WITHOUTCV_DETAILS = 'POST_PROFILE_WITHOUTCV_DETAILS';
export const PATCH_PROFILE_DETAILS = 'PATCH_PROFILE_DETAILS';
export const DELETE_PROFILE_DETAILS = 'DELETE_PROFILE_DETAILS';
export const POST_CANDIDATE_INVITE = 'POST_CANDIDTE_INVITE';
export const GET_CANDIDATE_PROFILE_DOWNLOAD = "CANDIDATE_PROFILE_DOWNLOAD";
export const GET_PRICING_PLAN_DETAILS = "PRICING_PLAN_DETAILS";

export const getProfileDetails = async (data) => {
  const res = await requestClient.get(`${API.PROFILE_API}?${apiLimit50000}`, { params: { status: data } })
  return ({
    type: GET_PROFILE_DETAILS,
    payload: res.data,
  });
};
export const getPricingPlanDetails = async () => {
  const res = await requestClient.get(`${API.GET_PRICING_PLANS_API}`)
  return ({
    type: GET_PRICING_PLAN_DETAILS,
    payload: res.data,
  });
};
export const getProfileSearchDetails = async (searchVal) => {
  const res = await requestClient.get(`${API.PROFILE_SEARCH_API}?keyword=${searchVal}&${apiLimit50000}`)
  return ({
    type: GET_PROFILE_SEARCH_DETAILS,
    payload: res.data,
  });
};
export const getExportTemplateDetails = async () => {
  const res = await requestClient.get(API.GET_EXPORT_TEMPLATE_API, { responseType: "blob" })
  return ({
    type: GET_EXPORT_TEMPLATE_DETAILS,
    payload: res.data,
  });
};

export const getProfileCV = async (resumeId) => {
  const res = await requestClient.get(`${API.PROFILE_API}/downloadresume/${resumeId}`, { responseType: "blob" })
  return ({
    type: GET_PROFILE_CV_DOWNLOAD,
    payload: res.data,
  });
};
export const getCandidateProfileDownload = async () => {
  const res = await requestClient.get(API.CANDIDATE_PROFILE_DOWNLOAD_API, { responseType: "blob" })
  return ({
    type: GET_CANDIDATE_PROFILE_DOWNLOAD,
    payload: res.data,
  });
};

export const postProfileDetails = async (data) => {
  const payload = data;
  const res = await requestClient.post(API.PROFILE_API, payload)
  return ({
    type: POST_PROFILE_DETAILS,
    payload: res,
  });
};

export const postCandidateInvite = async (data) => {
  const payload = data;
  const res = await requestClient.post(`${API.CANDIDATE_DETAILS_API}/invite`, payload)
  return ({
    type: POST_CANDIDATE_INVITE,
    payload: res,
  });
};

export const postProfileSearchDetails = async (filters, limit) => {
  const payload = { filters, limit };
  const res = await requestClient.post(`${API.PROFILE_SEARCH_API}?`, payload)
  return ({
    type: POST_PROFILE_SEARCH_DETAILS,
    payload: res,
  });
};

export const postWithoutCvDetails = async ({ ...data }) => {
  const payload = { ...data };
  const res = await requestClient.post(`${API.PROFILE_SEARCH_API}?`, payload)
  return ({
    type: POST_PROFILE_WITHOUTCV_DETAILS,
    payload: res,
  });
};

export const postProfileExportAllDetails = async (exportid, selectItem, excelExport, pay) => {
  const payload = selectItem ? excelExport : pay;
  const res = await requestClient.post(exportid ? API.POST_PROFILE_EXPORTALL_API : API.PROFILE_SEARCH_API, payload, { responseType: "blob" });
  return ({
    type: POST_PROFILE_EXPORTALL_DETAILS,
    payload: res.data,
  });
};

export const postProfileImportDetails = async (formData) => {
  const payload = formData;
  const res = await requestClient.post(API.POST_PROFILE_IMPORT_API, payload)
  return ({
    type: POST_PROFILE_IMPORT_DETAILS,
    payload: res,
  });
};
export const postUploadS3Details = async (formData,fileList) => {
  const payload = formData;
  const res = await requestClient.post(`${API.POST_UPLOAD_S3_API}?filesCount=${fileList}`, payload)
  return ({
    type: POST_UPLOAD_S3_DETAILS,
    payload: res,
  });
};

export const patchProfileDetails = async (id, firstName, lastName, email, phone_no, current_location, marital_status, status, present_address, date_of_birth, current_company, experience, education, primary_skill, secondary_skill, education_details, experience_details, current_ctc, expected_ctc, current_designation, industry, current_employment_status, notice_period, prefered_location, ready_to_relocate, overseas_experience, having_passport, passport_validity, visa, About) => {
  const payload = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "phone_no": phone_no,
    "current_location": current_location,
    "marital_status": marital_status,
    "status": status,
    "present_address": present_address,
    "date_of_birth": date_of_birth,
    "current_company": current_company,
    "experience": experience,
    "education": education,
    "primary_skill": primary_skill,
    "secondary_skill": secondary_skill,
    "education_details": education_details,
    "experience_details": experience_details,
    "current_ctc": current_ctc,
    "expected_ctc": expected_ctc,
    "current_designation": current_designation,
    "industry": industry,
    "current_employment_status": current_employment_status,
    "notice_period": notice_period,
    "prefered_location": prefered_location,
    "ready_to_relocate": ready_to_relocate,
    "overseas_experience": overseas_experience,
    "having_passport": having_passport,
    "passport_validity": passport_validity,
    "visa": visa,
    "About": About
  };
  const res = await requestClient.patch(`${API.PROFILE_API}/${id}`, payload)
  return ({
    type: PATCH_PROFILE_DETAILS,
    payload: res,
  });
};

export const deleteProfileDetails = async (deleteHelper) => {
  const res = await requestClient.delete(`${API.PROFILE_API}/${deleteHelper}`)
  return ({
    type: DELETE_PROFILE_DETAILS,
    payload: res,
  });
};
