import {
  GET_JOBOPENING_DETAILS,
  POST_JOBOPENING_DETAILS,
  PATCH_JOBOPENING_DETAILS,
  PATCH_JOBOPENING_ARCHIVE,
  GET_JOBAPPLICANT_DETAILS,
  POST_JOBAPPLICANT_DETAILS,
  PATCH_JOBAPPLICANT_DETAILS
} from '../actions/JobOpeningActions';

const initialState = [];

const JobOpeningReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_JOBOPENING_DETAILS: {
      return [...action.payload];
    }
    case GET_JOBAPPLICANT_DETAILS: {
      return [...action.payload];
    }
    case POST_JOBOPENING_DETAILS: {
      return [...action.payload];
    }
    case PATCH_JOBOPENING_DETAILS: {
      return [...action.payload];
    }
    case PATCH_JOBOPENING_ARCHIVE: {
      return [...action.payload];
    }
    case PATCH_JOBAPPLICANT_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default JobOpeningReducer;
