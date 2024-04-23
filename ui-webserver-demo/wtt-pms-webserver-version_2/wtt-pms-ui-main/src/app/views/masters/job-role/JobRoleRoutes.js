import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../../auth/authRoles';
import { jobRoleRoute } from 'app/utils/constant';

const JobRole = Loadable(lazy(() => import('./JobRole')));

const jobRoleRoutes = [
  { path: jobRoleRoute, element: <JobRole />, auth: authRoles.admin },
];

export default jobRoleRoutes;
