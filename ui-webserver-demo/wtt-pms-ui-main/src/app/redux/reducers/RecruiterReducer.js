import {
  GET_RECRUITER_DETAILS,
  POST_RECRUITER_DETAILS,
  PATCH_RECRUITER_DETAILS,
} from '../actions/RecruiterActions';

const initialState = [];

const RecruiterReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_RECRUITER_DETAILS: {
      return [...action.payload];
    }
    case POST_RECRUITER_DETAILS: {
      return [...action.payload];
    }
    case PATCH_RECRUITER_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default RecruiterReducer;
