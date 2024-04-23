import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_PRICINGPLAN_DETAILS = "GET_PRICINGPLAN_DETAILS"
export const GET_DASHBOARD_DETAILS = 'GET_DASHBOARD_DETAILS';
export const GET_CANDIDATE_DASHBOARD_DETAILS = 'GET_CANDIDATE_DASHBOARD_DETAILS';
export const GET_MENUACCESS_DETAILS = 'GET_MENUACCESS_DETAILS';
export const POST_NOTIFICATIONS_EMAIL = 'POST_NOTIFICATIONS_EMAIL';

export const getDashboardDetails = async () => {
  const res = await requestClient.get(API.GET_DASHBOARD_API)
  return ({
    type: GET_DASHBOARD_DETAILS,
    payload: res.data,
  });
};
export const getDashboardPricingPlanDetails = async () => {
  const res = await requestClient.get(API.GET_DASHBOARD_PRICINGPlAN_API)
  return ({
    type: GET_PRICINGPLAN_DETAILS,
    payload: res.data,
  });
};

export const getCandidateDashboardDetails = async () => {
  const res = await requestClient.get(`${API.CANDIDATE_DETAILS_API}/KPI`)
  return ({
    type: GET_CANDIDATE_DASHBOARD_DETAILS,
    payload: res.data,
  });
};

export const getMenuAccessDetails = async () => {
  const res = await requestClient.get(API.GET_MENUACCESS_API)
  return ({
    type: GET_MENUACCESS_DETAILS,
    payload: res.data,
  });
};

export const postNotificationsEmail = async (JobOpeningId, toList, bccList, ccList, subject, body) => {       //
  const payLoad = { JobOpeningId, toList, bccList, ccList, subject, body };
  const res = await requestClient.post(API.POST_NOTIFICATIONS_EMAIL_API, payLoad)
  return ({
    type: POST_NOTIFICATIONS_EMAIL,
    payload: res,
  });
};
