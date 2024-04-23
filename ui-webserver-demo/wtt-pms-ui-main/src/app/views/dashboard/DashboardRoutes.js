import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { candidateDashboardRoute, dashboardRoute, jobDetailRoute, profileRoute ,changePasswordRoute } from 'app/utils/constant';

const Analytics = Loadable(lazy(() => import('./Analytics')));
const CandidateAnalytics = Loadable(lazy(() => import('./CandidateAnalytics')));
const ProfileUpdate = Loadable(lazy(() => import('../../components/UserProfile/UserProfile')));
const JobDetails = Loadable(lazy(() => import('../../components/JobDetails/JobDetails')));
const ChangePassword = Loadable(lazy(() => import('../sessions/ChangePassword')));

const dashboardRoutes = [
  { path: dashboardRoute, element: <Analytics />, auth: authRoles.admin },
  { path: candidateDashboardRoute, element: <CandidateAnalytics />, auth: authRoles.admin },
  { path: profileRoute, element: <ProfileUpdate />, auth: authRoles.admin },
  { path: jobDetailRoute, element: <JobDetails />, auth: authRoles.admin },
  { path: changePasswordRoute, element: <ChangePassword />, auth: authRoles.admin },
]
 

export default dashboardRoutes;
