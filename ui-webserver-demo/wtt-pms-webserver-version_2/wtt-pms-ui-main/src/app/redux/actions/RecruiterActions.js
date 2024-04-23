import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";
import { apiLimit1000 } from 'app/utils/constant';
export const GET_RECRUITER_DETAILS = 'GET_RECRUITER_DETAILS';
export const POST_RECRUITER_DETAILS = 'POST_RECRUITER_DETAILS';
export const PATCH_RECRUITER_DETAILS = 'PATCH_RECRUITER_DETAILS';


export const getRecruiterDetails = async () => {
  const res = await requestClient.get(`${API.RECRUITER_API}?${apiLimit1000}`)
  return ({
    type: GET_RECRUITER_DETAILS,
    payload: res,
  });
};

export const postRecruiterDetails = async ({ ...recruiterData }) => {
  const payload = { ...recruiterData };
  const res = await requestClient.post(API.RECRUITER_API, payload)
  return ({
    type: POST_RECRUITER_DETAILS,
    payload: res,
  });
};

export const patchRecruiterDetails = async (id, firstName, lastName, mobileNumber, emailAddress) => {
  const payLoad = { id, firstName, lastName, mobileNumber, emailAddress };
  const res = await requestClient.patch(API.RECRUITER_API, payLoad)
  return ({
    type: PATCH_RECRUITER_DETAILS,
    payload: res,
  });
};
