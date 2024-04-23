import {
  GET_JOBDETAILS,
} from '../actions/JobDescriptionActions';

const initialState = [];

const JobDetailsReducer = (state = initialState, action)=>{
  switch (action.type) {
    case GET_JOBDESCRIPTION: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default JobDescriptionReducer;
