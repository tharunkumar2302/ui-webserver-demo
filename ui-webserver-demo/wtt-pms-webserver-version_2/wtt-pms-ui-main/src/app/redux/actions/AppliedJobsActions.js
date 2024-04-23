import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_APPLIEDJOBS_DETAILS = 'GET_APPLIEDJOBS_DETAILS';

export const getAppliedJobsDetails = async () => {
  const res = await requestClient.get(`${API.JOBAPPLICANT_CURRENT_USER_API}`)
  return ({
    type: GET_APPLIEDJOBS_DETAILS,
    payload: res.data,
  });
};

