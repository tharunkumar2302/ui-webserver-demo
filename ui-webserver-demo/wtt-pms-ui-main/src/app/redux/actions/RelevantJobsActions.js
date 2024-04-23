import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const POST_RELEVANTJOB_DETAILS = 'POST_RELEVANTJOB_DETAILS';


export const postRelevantJobDetails = async ({ ...filterParmeters }) => {
  const payload = { ...filterParmeters };
  console.log(payload);
  const res = await requestClient.get(`${API.JOBOPENING_API}/filter`, { params: { keyword: payload.keyword, showRelvantJobs: true, limit: '1000' } })
  return ({
    type: POST_RELEVANTJOB_DETAILS,
    payload: res,
  });
};
