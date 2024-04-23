import AuthGuard from "app/auth/AuthGuard";
import chartsRoute from "app/views/charts/ChartsRoute";
import dashboardRoutes from "app/views/dashboard/DashboardRoutes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import NotFound from "app/views/sessions/NotFound";
import sessionRoutes from "app/views/sessions/SessionRoutes";
import { Navigate } from "react-router-dom";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import jobOpeningRoutes from "./views/job-opening/JobOpeningRoutes";
import jobRoleRoutes from "./views/masters/job-role/JobRoleRoutes";
import profileRoutes from "./views/profile/ProfileRoutes";
import recruiterRoutes from "./views/recruiter/RecruiterRoutes";
import relevantJobsRoutes from "./views/relevant-jobs/RelevantJobsRoutes";
import appliedJobsRoutes from "./views/applied-jobs/AppliedJobsRoutes";
import bulkUploadRoutes from "./views/bulk-profileuploads/BulkUploadsRoutes";
import organizationRoutes from "./views/organization/organizationRoutes";
const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...chartsRoute,
      ...materialRoutes,
      ...jobRoleRoutes,
      ...profileRoutes,
      ...jobOpeningRoutes,
      ...recruiterRoutes,
      ...relevantJobsRoutes,
      ...appliedJobsRoutes,
      ...bulkUploadRoutes,
      ...organizationRoutes,
    ],
  },
  ...sessionRoutes,
  { path: "/", element: <Navigate to="dashboard/default" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
