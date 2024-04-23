import {
  GET_DASHBOARD_DETAILS,
  GET_PRICINGPLAN_DETAILS,
  GET_CANDIDATE_DASHBOARD_DETAILS,
  GET_MENUACCESS_DETAILS,
  POST_NOTIFICATIONS_EMAIL,
} from '../actions/CommonActions';

const initialState = [];

const CommonReducer =(state = initialState, action)=> {
  switch (action.type) {
    case GET_DASHBOARD_DETAILS: {
      return [...action.payload];
    }
    case GET_PRICINGPLAN_DETAILS:{
      return [...action.payload];
    }
    case GET_CANDIDATE_DASHBOARD_DETAILS: {
      return [...action.payload];
    }
    case GET_MENUACCESS_DETAILS: {
      return [...action.payload];
    }
    case POST_NOTIFICATIONS_EMAIL: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default CommonReducer;
