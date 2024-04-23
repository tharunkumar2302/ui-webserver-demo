import {
  POST_JOBROLE_DETAILS,
} from '../actions/RelevantJobsActions';

const initialState = [];

const RelevantJobsReducer = (state = initialState, action)=> {
  switch (action.type) {
    case POST_JOBROLE_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default RelevantJobsReducer;
