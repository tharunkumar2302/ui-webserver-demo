const allRoles = {
  employer: [
    'addRecruiter',
    'getRecruiter',
    'manageResume',
    'getResume',
    'uploadProfile',
    'ManageNotification',
    'GetFilterJobOpening',
    'getMenuAccess',
    'getOrganization',
    'orgFilter',
    'ManageJobRole'
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'manageSystemRoles',
    'getSystemRoles',
    'getJobRole',
    'GetJobOpening',
    'getRecruiter',
    'ManageJobRole',
    'manageResume',
    'ManageJobOpening',
    'getResume',
    'uploadProfile',
    'addRecruiter',
    'getRecruiter',
    'manageJobApplicant',
    'getJobApplicant',
    'ManageNotification',
    'manageMenuAccess',
    'manageOrganization',
    'getMenuAccess',
    'getOrganization',
    'GetFilterJobOpening',
    'orgFilter',
    'manageInviteCandidate',
  ],
  candidate: [
    'GetJobOpening',
    'getMenuAccess',
    'manageJobApplicantForSelf',
    'getJobApplicantForSelf',
    'GetReleventJobs',
    'uploadProfile',
    'getOrganization',
    'candidateKPI',
    'GetFilterJobOpening',
    'getResume'
  ],
  recruiter: [
    'ManageJobRole',
    'getJobRole',
    'ManageJobOpening',
    'GetJobOpening',
    'manageResume',
    'getResume',
    'uploadProfile',
    'manageJobApplicant',
    'getJobApplicant',
    'ManageNotification',
    'getMenuAccess',
    'manageInviteCandidate',
    'GetFilterJobOpening',
    'getOrganization',
    'orgFilter',
    'manageInterviewSchedule',
    'getInterviewSchedule'
  ],
  superuser: [
    'getUsers',
    'manageUsers',
    'manageSystemRoles',
    'getSystemRoles',
    'getJobRole',
    'GetJobOpening',
    'getRecruiter',
    'ManageJobRole',
    'manageResume',
    'ManageJobOpening',
    'getResume',
    'uploadProfile',
    'addRecruiter',
    'getRecruiter',
    'manageJobApplicant',
    'getJobApplicant',
    'ManageNotification',
    'manageMenuAccess',
    'manageOrganization',
    'getMenuAccess',
    'getOrganization',
    'GetFilterJobOpening',
    'orgFilter',
    'manageInviteCandidate',
    'manageEmployer'
  ]
};
/**
 * @Roles
 * admin - full access ,
 * employer - need to discuss,
 * candidate - similar to user role
 * recruiter - need to discuss
 */
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  allRoles,
};
