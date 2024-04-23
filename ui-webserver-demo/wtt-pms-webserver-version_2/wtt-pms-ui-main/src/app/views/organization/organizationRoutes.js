import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { organizationRoute } from 'app/utils/constant';

const Organization = Loadable(lazy(() => import('./organization')));

const organizationRoutes = [
  { path: organizationRoute, element: <Organization/>, auth: authRoles.admin },
];

export default organizationRoutes;
