import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { relevantJobRoute } from 'app/utils/constant';

const RelevantJobs = Loadable(lazy(() => import('./RelevantJobs')));

const relevantJobsRoutes = [
  { path: relevantJobRoute, element: <RelevantJobs />, auth: authRoles.admin },
];

export default relevantJobsRoutes;
