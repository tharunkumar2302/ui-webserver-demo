import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import { bulkuploadRoute } from 'app/utils/constant';
const UploadProfiles = Loadable(lazy(() => import('./BulkUploads')));

const bulkUploadRoutes = [
  { path: bulkuploadRoute, element: <UploadProfiles />, auth: authRoles.admin },
];

export default bulkUploadRoutes;