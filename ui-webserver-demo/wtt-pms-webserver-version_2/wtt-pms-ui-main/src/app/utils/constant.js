export const defaultCalendarValue = "today"
export const apiLimit100 = 'limit=100'
export const apiLimit200 = 200
export const apiPageNo1 = 1
export const apiLimit1000 = 'limit=1000'
export const apiLimit50000 ='limit=50000'
export const value100Per = '100%'
export const value100PerImp = '100%!important'
export const topBarHeight = 64
export const sideNavWidth = 260
export const navbarHeight = 60
export const sidenavCompactWidth = 80
export const containedLayoutWidth = 1200
export const tableHeight = '65vh'
export const tableHeightProfile = '70.5vh'
export const tableHeightJobOpening = '68.5vh'
export const doughnuHeight = '310px'
export const doughnuHeightCand = '250px'
export const doughnutWidth = '77vw'
export const doughnutWidthCand = '82vw'
export const tableContentColWidth = 150
export const tableIconColWidth = 100
export const tableCheckIconColWidth = 50
export const tableCheckjobRolColWidth = 43
export const tableContentColGrow = 5
export const tableIconColGrow = 3
export const tableCheckboxColGrow = 2
export const paginationSize = 10
export const paginationSizeSelector = [50, 100, 150]
export const selectItem = []
export const statusValues = ['Published', 'Draft']
export const CandidateJobApplicantStatus = ["applied",'shortlisted', 'l1 select', 'l2 select', 'final select', 'offered', 'joined']

// navigation Router Constants
export const candidateDashboardRoute = '/dashboard-c/default'
export const dashboardRoute = '/dashboard/default'
export const appliedJobsRoute = '/dashboard/appliedjobs'
export const profileDashRoute = '/dashboard/profile'
export const jobDetailRoute = '/dashboard/jobdetails'
export const jobOpeningRoute = '/dashboard/jobopening'
export const jobRoleRoute = '/dashboard/masters/jobrole'
export const recruiterRoute = '/dashboard/recruiter'
export const relevantJobRoute = '/dashboard/relevantjobs'
export const profileRoute = '/session/profile'
export const bulkuploadRoute = '/dashboard/bulk-uploads'
export const organizationRoute = '/dashboard/organization'
export const logInRoute = '/session/signin'
export const changePasswordRoute = '/session/change-password'
export const registerRoute = '/session/signup'
export const forgotPasswordRoute = '/session/forgot-password'

// Get from Local Storage Constants
export const localStorageAccessToken = () => localStorage.getItem('accessToken');
export const localStorageRefreshToken = () => localStorage.getItem('refreshToken');
export const localStorageUserRole = () => localStorage.getItem('userRole');
export const localStorageCandidate = () => JSON.parse(localStorage.getItem('userDetails'));
export const localStorageUserfile = () => localStorage.getItem('userfile');

//Input type="number"
export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();


// Icon Constants
export const editIcon = () => {
  return "<i class='fa-sharp fa-solid fa-pen' style='color: rgb(25, 118, 210);cursor:pointer;'></i>";
};
export const editJobApplicantIcon = () => {
  return "<i class='fa-solid fa-thumbs-up' style='color: rgb(25, 118, 210);cursor:pointer;'></i>";
};
export const rejectedJobApplicantIcon = () => {
  return "<i class='fa-solid fa-ban' style='color: rgb(255, 61, 87);cursor:pointer;'></i>";
};

export const deleteIcon = () => {
  return "<i class='fa-sharp fa-solid fa-trash' style='color: rgb(255, 61, 87);cursor:pointer;'></i>";
};
export const archiveIcon = () => {
  return "<i class='fa-solid fa-box-archive' style='color: rgb(255, 175, 56);cursor:pointer;'></i>";
};
export const profileIcon = () => {
  return "<i class='fa fa-user' style='color: rgb(25, 118, 210);cursor:pointer;'></i>";
};
export const tableButton = () => {
  return "<button class='grid-button-custom'>View</button>";
}

export const headingShowApplicantsIcon = () => {
  return "<i class='fa-solid fa-people-group' style='color: rgb(25, 118, 210);cursor:pointer;'></i>"
}