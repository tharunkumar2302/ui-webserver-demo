import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { jobOpeningRoute } from 'app/utils/constant';

const JobOpening = Loadable(lazy(() => import('./JobOpening')));

const jobOpeningRoutes = [
  { path: jobOpeningRoute, element: <JobOpening />, auth: authRoles.admin },
];

export default jobOpeningRoutes;
