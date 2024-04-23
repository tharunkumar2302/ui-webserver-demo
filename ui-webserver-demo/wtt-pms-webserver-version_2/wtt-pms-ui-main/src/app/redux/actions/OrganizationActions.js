import requestClient from '../../apiManager/interceptors'
import API from "../../apiManager/endpoints/index";

export const GET_ORGANIZATION_DETAILS = 'GET_ORGANIZATION_DETAILS';
export const GET_ORGANIZATION_TABLE_DETAILS = 'GET_ORGANIZATION_TABLE_DETAILS';
export const POST_EMP_ORG_DETAILS = 'POST_EMP_ORG_DETAILS';
export const PATCH_EMP_ORG_DETAILS = 'PATCH_EMP_ORG_DETAILS';

export const getOrganizationDetails = async () => {
  const res = await requestClient.get(`${API.ORGANIZATION_API}`)
  return ({
    type: GET_ORGANIZATION_DETAILS,
    payload: res.data,
  });
};
export const getEmpOrganizationTableDetails = async () => {
  const res = await requestClient.get(`${API.EMPLOYER_ORGANIZATION_TABLE_API}`)
  return ({
    type: GET_ORGANIZATION_TABLE_DETAILS,
    payload: res.data,
  });
};

export const postEmpOrgDetails = async ({ ...recruiterData }) => {
  const payload = { ...recruiterData, pricingPlan: toString.call( recruiterData.pricingPlan).slice(8,-1) === 'String'?recruiterData.pricingPlan : recruiterData.pricingPlan.name };
  delete payload.organization;
  const res = await requestClient.post(API.EMP_ORGANIZATION_API, payload)
  return ({
    type: POST_EMP_ORG_DETAILS,
    payload: res,
  });
};
export const patchEmpOrgDetails = async (id, firstName, lastName, mobileNumber, emailAddress ,organizationName,pricingPlan,designation,status) => {
  const payLoad = { id, firstName, lastName, mobileNumber, emailAddress,organizationName,pricingPlan,designation,status };
  const res = await requestClient.patch(API.PATCH_EMPLOYER_ORGANIZATION_TABLE_API, payLoad)
  return ({
    type: PATCH_EMP_ORG_DETAILS,
    payload: res,
  });
};
