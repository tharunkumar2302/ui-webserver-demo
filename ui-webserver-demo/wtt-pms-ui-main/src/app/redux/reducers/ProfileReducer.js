import {
  GET_PROFILE_DETAILS,
  GET_EXPORT_TEMPLATE_DETAILS,
  GET_PROFILE_SEARCH_DETAILS,
  GET_PROFILE_CV_DOWNLOAD,
  POST_PROFILE_IMPORT_DETAILS,
  POST_PROFILE_DETAILS,
  POST_PROFILE_EXPORTALL_DETAILS,
  POST_PROFILE_SEARCH_DETAILS,
  POST_CANDIDATE_INVITE,
  POST_UPLOAD_S3_DETAILS,
  PATCH_PROFILE_DETAILS,
  DELETE_PROFILE_DETAILS,
  POST_PROFILE_WITHOUTCV_DETAILS
} from '../actions/ProfileActions';

const initialState = [];

const JobRoleReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_PROFILE_DETAILS: {
      return [...action.payload];
    }
    case GET_EXPORT_TEMPLATE_DETAILS: {
      return [...action.payload];
    }
    case GET_PROFILE_SEARCH_DETAILS: {
      return [...action.payload];
    }
    case GET_PROFILE_CV_DOWNLOAD: {
      return [...action.payload];
    }
    case POST_PROFILE_DETAILS: {
      return [...action.payload];
    }
    case POST_PROFILE_SEARCH_DETAILS: {
      return [...action.payload];
    }
    case POST_PROFILE_EXPORTALL_DETAILS: {
      return [...action.payload];
    }
    case POST_PROFILE_IMPORT_DETAILS: {
      return [...action.payload];
    }
    case POST_UPLOAD_S3_DETAILS: {
      return [...action.payload];
    }
    case POST_CANDIDATE_INVITE: {
      return [...action.payload];
    }
    case PATCH_PROFILE_DETAILS: {
      return [...action.payload];
    }
    case POST_PROFILE_WITHOUTCV_DETAILS: {
      return [...action.payload];
    }
    case DELETE_PROFILE_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default JobRoleReducer;
