import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";
import { apiLimit1000 } from 'app/utils/constant';

export const GET_JOBROLE_DETAILS = 'GET_JOBROLE_DETAILS';
export const POST_JOBROLE_DETAILS = 'POST_JOBROLE_DETAILS';
export const PATCH_JOBROLE_DETAILS = 'PATCH_JOBROLE_DETAILS';
export const DELETE_JOBROLE_DETAILS = 'DELETE_JOBROLE_DETAILS';

export const getJobRoleDetails = async () => {
  const res = await requestClient.get(`${API.JOBROLE_API}?${apiLimit1000}`)
  return ({
    type: GET_JOBROLE_DETAILS,
    payload: res.data,
  });
};

export const deleteJobRoleDetails = async (deleteHelper) => {
  const res = await requestClient.delete(`${API.JOBROLE_API}/${deleteHelper}`)
  return ({
    type: DELETE_JOBROLE_DETAILS,
    payload: res,
  });
};

export const postJobRoleDetails = async ({ ...jobRoleData }) => {
  const payload = { ...jobRoleData };
  const res = await requestClient.post(API.JOBROLE_API, payload)
  return ({
    type: POST_JOBROLE_DETAILS,
    payload: res,
  });
};

export const patchJobRoleDetails = async (name, description, id) => {
  const payload = { name, description };
  const res = await requestClient.patch(`${API.JOBROLE_API}/${id}`, payload)
  return ({
    type: PATCH_JOBROLE_DETAILS,
    payload: res,
  });
};
