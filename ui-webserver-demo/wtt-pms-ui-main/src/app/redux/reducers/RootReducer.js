import { combineReducers } from 'redux';
import EcommerceReducer from './EcommerceReducer';
import NavigationReducer from './NavigationReducer';
import NotificationReducer from './NotificationReducer';
import JobRoleReducer from './JobRoleReducer';

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  jobRole: JobRoleReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
});

export default RootReducer;
