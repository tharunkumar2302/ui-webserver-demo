import Loadable from 'app/components/Loadable';
import { SelectDataTableProvider } from 'app/contexts/SelectTableDataContext';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { profileDashRoute } from 'app/utils/constant';

const Profile = Loadable(lazy(() => import('./Profile')));

const profileRoutes = [
  { path: profileDashRoute, element: <SelectDataTableProvider> <Profile /> </SelectDataTableProvider>, auth: authRoles.admin },
];

export default profileRoutes;
