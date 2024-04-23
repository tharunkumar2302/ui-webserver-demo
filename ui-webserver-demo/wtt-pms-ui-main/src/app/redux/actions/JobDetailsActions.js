import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_JOBDETAILS = 'GET_JOBDETAILS';
export const POST_JOBDETAILS = 'POST_JOBDETAILS';
export const PATCH_JOBDETAILS = 'PATCH_JOBDETAILS';


export const getJobDetails = async (jobId) => {
  const res = await requestClient.get(`${API.JOBOPENING_API}/${jobId}`)
  return ({
    type: GET_JOBDETAILS,
    payload: res.data,
  });
};

export const postJobDetails = async ({ ...jobData }) => {
  const payload = { ...jobData };
  const res = await requestClient.post(API.JOBAPPLICANT_CURRENT_USER_API, payload)
  return ({
    type: POST_JOBDETAILS,
    payload: res,
  });
};

export const patchJobDetails = async ({ ...jobData }) => {

  const payload = { ...jobData };
  const res = await requestClient.patch(`${API.JOBAPPLICANT_CURRENT_USER_API}`, payload)
  return ({
    type: PATCH_JOBDETAILS,
    payload: res,
  });
};
