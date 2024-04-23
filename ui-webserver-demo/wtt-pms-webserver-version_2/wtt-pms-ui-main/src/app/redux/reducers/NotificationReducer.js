import {
  CREATE_NOTIFICATION,
  DELETE_ALL_NOTIFICATION,
  DELETE_NOTIFICATION,
  GET_NOTIFICATION,
} from '../actions/NotificationActions';

const initialState = [];

const NotificationReducer = (state = initialState, action)=> {
  switch (action.type) {
    case GET_NOTIFICATION: {
      return [...action.payload];
    }
    case CREATE_NOTIFICATION: {
      return [...action.payload];
    }
    case DELETE_NOTIFICATION: {
      return [...action.payload];
    }
    case DELETE_ALL_NOTIFICATION: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default NotificationReducer;