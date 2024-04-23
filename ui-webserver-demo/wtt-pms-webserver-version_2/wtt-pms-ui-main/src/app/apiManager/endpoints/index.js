/* eslint-disable max-len */
import { REACT_APP_SERVICE_URL, REACT_APP_SYSTEM_URL } from "./config";

const API = {
    // Pass token in url
    SESSION_API: `${REACT_APP_SYSTEM_URL}/session`,

    // GET method of DASHBOARD
    GET_DASHBOARD_API: `${REACT_APP_SERVICE_URL}/resumes/kpi`,

    //GET method of pricingplan dropdown
    GET_PRICING_PLANS_API: `${REACT_APP_SERVICE_URL}/pricingPlan/plans`,
  
    // GET method of PricingPlan Dashboard
    GET_DASHBOARD_PRICINGPlAN_API: `${REACT_APP_SERVICE_URL}/pricingPlan`,

    // GET method of MENUACCESS
    GET_MENUACCESS_API: `${REACT_APP_SERVICE_URL}/menuAccess`,

    // POST method of NOTIFICATIONS EMAIL
    POST_NOTIFICATIONS_EMAIL_API: `${REACT_APP_SERVICE_URL}/notification`,

    //GET & PATCH methods of CURRENT USER
    CURRENTUSER_API: `${REACT_APP_SERVICE_URL}/users/currentUser`,

    //GET, POST & PATCH methods of JOB OPENING, FILTER & ARCHIVE
    JOBOPENING_API: `${REACT_APP_SERVICE_URL}/jobOpening`,

    //GET methods of JOB APPLICANT
    JOBAPPLICANT_API: `${REACT_APP_SERVICE_URL}/jobApplicant`,

    //GET, PATCH ,POST methods of JOB APPLICANT current User(Candidate)
    JOBAPPLICANT_CURRENT_USER_API: `${REACT_APP_SERVICE_URL}/jobApplicant/currentUser`,

    //GET, POST, DELETE & PATCH methods of JOB ROLE
    JOBROLE_API: `${REACT_APP_SERVICE_URL}/jobRole`,

    //GET, POST, DELETE & PATCH methods of JOB ROLE
    ORGANIZATION_API: `${REACT_APP_SERVICE_URL}/organizations`,    
  
    //GET, POST & PATCH methods of JOB ROLE
    RECRUITER_API: `${REACT_APP_SERVICE_URL}/users/recruiter`,

     //GET, POST & PATCH methods of EMPLOYER ORGANIZATION

     //POST
    EMP_ORGANIZATION_API: `${REACT_APP_SERVICE_URL}/auth/register-employer`,  
    //GET
    EMPLOYER_ORGANIZATION_TABLE_API: `${REACT_APP_SERVICE_URL}/employerData`,
    //PATCH
    PATCH_EMPLOYER_ORGANIZATION_TABLE_API: `${REACT_APP_SERVICE_URL}/employerData/updateData`,

    //GET, POST, PATCH, DELETE methods of PROFILE
    PROFILE_API: `${REACT_APP_SERVICE_URL}/resumes`,
    CANDIDATE_PROFILE_DOWNLOAD_API: `${REACT_APP_SERVICE_URL}/resumes/resumedownload`,

    //GET & POST methods of PROFILE SEARCH
    PROFILE_SEARCH_API: `${REACT_APP_SERVICE_URL}/resumes/searchFilter`,

    // Profile Import and Export APIs
    POST_PROFILE_EXPORTALL_API: `${REACT_APP_SERVICE_URL}/resumes/export`,
    POST_PROFILE_IMPORT_API: `${REACT_APP_SERVICE_URL}/resumes/import`,
    GET_EXPORT_TEMPLATE_API: `${REACT_APP_SERVICE_URL}/resumes/importTemplate`,

    // Profile Upload API
    POST_UPLOAD_S3_API: `${REACT_APP_SERVICE_URL}/resumes/profileupload`,

    // Authentication APIs
    LOGIN_API: `${REACT_APP_SERVICE_URL}/auth/login`,
    REGISTER_API: `${REACT_APP_SERVICE_URL}/auth/register`,
    LOGOUT_API: `${REACT_APP_SERVICE_URL}/auth/logout`,
    FORGOT_PASSWORD_API: `${REACT_APP_SERVICE_URL}/auth/forgot-password`,
    CONFIRM_PASSWORD_API: `${REACT_APP_SERVICE_URL}/auth/reset-password`,
    CHANGED_PASSWORD_API: `${REACT_APP_SERVICE_URL}/auth/change-password`,
    CANDIDATE_DETAILS_API: `${REACT_APP_SERVICE_URL}/candidate`
};

export default API;
