import {
  GET_CURRENTUSER_DETAILS,
  GET_USERPOFILE_DETAILS,
  PATCH_CURRENTUSER_DETAILS,
  PATCH_CANDIDATEUSER_DETAILS,
} from '../actions/CurrentUserActions';

const initialState = [];

const CurrentUserReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_CURRENTUSER_DETAILS: {
      return [...action.payload];
    }
    case GET_USERPOFILE_DETAILS: {
      return [...action.payload];
    }
    case PATCH_CURRENTUSER_DETAILS: {
      return [...action.payload];
    }
    case PATCH_CANDIDATEUSER_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default CurrentUserReducer;
