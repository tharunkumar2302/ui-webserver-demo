import {
  GET_JOBROLE_DETAILS,
  POST_JOBROLE_DETAILS,
  PATCH_JOBROLE_DETAILS,
  DELETE_JOBROLE_DETAILS,
} from '../actions/JobRoleActions';

const initialState = [];

const JobRoleReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_JOBROLE_DETAILS: {
      return [...action.payload];
    }
    case POST_JOBROLE_DETAILS: {
      return [...action.payload];
    }
    case DELETE_JOBROLE_DETAILS: {
      return [...action.payload];
    }
    case PATCH_JOBROLE_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default JobRoleReducer;
