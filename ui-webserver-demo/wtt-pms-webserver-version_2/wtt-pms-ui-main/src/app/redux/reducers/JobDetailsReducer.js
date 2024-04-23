import {
  GET_JOBDETAILS,
  POST_JOBDETAILS,
  PATCH_JOBDETAILS,
} from '../actions/JobDetailsActions';

const initialState = [];

const JobDetailsReducer = (state = initialState, action)=>{
  switch (action.type) {
    case GET_JOBDETAILS: {
      return [...action.payload];
    }
    case POST_JOBDETAILS: {
      return [...action.payload];
    }
    case PATCH_JOBDETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default JobDetailsReducer;
