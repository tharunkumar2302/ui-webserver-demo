import {
  GET_APPLIEDJOBS_DETAILS,

} from '../actions/AppliedJobsActions';

const initialState = [];

const AppliedJobsReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_APPLIEDJOBS_DETAILS: {
      return [...action.payload];
    }

    default: {
      return [...state];
    }
  }
};

export default AppliedJobsReducer;
