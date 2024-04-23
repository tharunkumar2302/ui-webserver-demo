import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";
import { apiLimit1000 } from 'app/utils/constant';
export const GET_JOBOPENING_DETAILS = 'GET_JOBOPENING_DETAILS';
export const POST_JOBOPENING_DETAILS = 'POST_JOBOPENING_DETAILS';
export const PATCH_JOBOPENING_DETAILS = 'PATCH_JOBOPENING_DETAILS';
export const PATCH_JOBOPENING_ARCHIVE = 'PATCH_JOBOPENING_ARCHIVE';
export const GET_JOBAPPLICANT_DETAILS = 'GET_JOBAPPLICANT_DETAILS';
export const PATCH_JOBAPPLICANT_DETAILS = 'PATCH_JOBAPPLICANT_DETAILS';

export const getJobOpeningDetails = async (data) => {
  const res = await requestClient.get(`${API.JOBOPENING_API}?${apiLimit1000}`, { params: { status: data } })
  return ({
    type: GET_JOBOPENING_DETAILS,
    payload: res.data,
  });
};

export const postJobOpeningDetails = async (ressDtaa) => {
  const payLoad = ressDtaa;
  const res = await requestClient.post(API.JOBOPENING_API, payLoad)
  return ({
    type: POST_JOBOPENING_DETAILS,
    payload: res,
  });
};

export const patchJobOpeningDetails = async (id, department, industryType,responsibilities, skillsRequired,secondarySkills,shortJD, description, qualification, location, minExperience, maxExperience, jobRole, employmentType, duration, workMode, status, tags, totalOpenings) => {
  const payLoad = { department, industryType, responsibilities, skillsRequired,secondarySkills,shortJD, description, qualification, location, minExperience, maxExperience, jobRole, employmentType, duration, workMode, status, tags, totalOpenings };
  const res = await requestClient.patch(`${API.JOBOPENING_API}/${id}`, payLoad)
  return ({
    type: PATCH_JOBOPENING_DETAILS,
    payload: res,
  });
};

export const patchJobOpeningArchive = async (id, status) => {
  const payLoad = { status };
  const res = await requestClient.patch(`${API.JOBOPENING_API}/${id}`, payLoad)
  return ({
    type: PATCH_JOBOPENING_ARCHIVE,
    payload: res,
  });
};

export const getJobApplicantDetails = async (id) => {
  const res = await requestClient.get(`${API.JOBAPPLICANT_API}?jobApplication=${id}&${apiLimit1000}`)
  return ({
    type: GET_JOBAPPLICANT_DETAILS,
    payload: res.data,
  });
};

export const patchJobApplicantDetails = async (id, status ,comments) => {
  const payLoad = { comments ,status };
  const res = await requestClient.patch(`${API.JOBAPPLICANT_API}/${id}`, payLoad)
  return ({
    type: PATCH_JOBAPPLICANT_DETAILS,
    payload: res,
  });
};
