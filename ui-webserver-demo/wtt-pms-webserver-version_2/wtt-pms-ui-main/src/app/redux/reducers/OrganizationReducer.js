import {
  GET_ORGANIZATION_DETAILS,
} from '../actions/OrganizationActions';

const initialState = [];

const OrganizationReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_ORGANIZATION_DETAILS: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default OrganizationReducer;
