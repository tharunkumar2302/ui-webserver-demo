import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_JOBDESCRIPTION = 'GET_JOBDESCRIPTION';


export const getJobDescription = async (jobId) => {
  const res = await requestClient.get(`${API.JOBOPENING_API}/jobs/${jobId}`)
  return ({
    type: GET_JOBDESCRIPTION,
    payload: res.data,
  });
};
