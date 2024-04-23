import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { recruiterRoute } from 'app/utils/constant';

const Recruiter = Loadable(lazy(() => import('./Recruiter')));

const recruiterRoutes = [
  { path: recruiterRoute, element: <Recruiter />, auth: authRoles.admin },
];

export default recruiterRoutes;
