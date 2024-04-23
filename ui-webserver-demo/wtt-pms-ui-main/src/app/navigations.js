import { appliedJobsRoute, candidateDashboardRoute, dashboardRoute, jobOpeningRoute, jobRoleRoute, profileDashRoute, recruiterRoute, relevantJobRoute, bulkuploadRoute, organizationRoute } from "./utils/constant";

export const navigations = [
  { key: 'Dashboard', name: 'Dashboard', path: dashboardRoute, icon: 'dashboard' },
  { key: 'Recruiter', name: 'Recruiter', path: recruiterRoute, icon: 'business_center' },
  { key: 'JobOpening', name: 'Job Opening', path: jobOpeningRoute, icon: 'work' },
  { key: 'Profile', name: 'Profile', path: profileDashRoute, icon: 'person' },
  { key: 'Dashboard-c', name: 'Dashboard', path: candidateDashboardRoute, icon: 'dashboard' },
  { key: 'RelvantJobs', name: 'Relvant Jobs', path: relevantJobRoute, icon: 'pageview' }, //notifications_active, folder_special 
  { key: 'AppliedJobs', name: 'Applied Jobs', path: appliedJobsRoute, icon: 'verified_user' },
  { key: 'BulkUploads', name: 'Bulk Uploads', path: bulkuploadRoute, icon: 'verified_user' },
  { key: "Organization", name: "Organization", path: organizationRoute, icon: 'business_center' },
  {
    key: 'Masters', name: 'Masters', icon: 'people',
    children: [
      { key: 'JobRole', name: 'Job Role',  icon: 'manage_accounts_icon', path: jobRoleRoute },
    ],
  },
];
