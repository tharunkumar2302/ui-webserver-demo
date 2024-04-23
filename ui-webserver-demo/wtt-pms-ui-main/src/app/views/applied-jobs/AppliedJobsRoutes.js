import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { appliedJobsRoute } from 'app/utils/constant';

const AppliedJobs = Loadable(lazy(() => import('./AppliedJobs')));

const appliedJobsRoutes = [
  { path: appliedJobsRoute, element: <AppliedJobs />, auth: authRoles.admin },
];

export default appliedJobsRoutes;
