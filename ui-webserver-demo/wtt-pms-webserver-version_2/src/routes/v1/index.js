const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const systemRolesRoute = require('./systemRoles.route');
const organizationRoute = require('./organization.route');
const jobRoleRoute = require('./jobRole.route');
const jobOpeningRoute = require('./jobOpening.route');
const config = require('../../config/config');
const resumesRoute = require('./resumes.route');
const notificationRoute = require('./notification.route');
const menuAccessRoute = require('./menuAccess.route');
const jobApplicantRoute = require('./jobApplicant.route');
const healthRoute = require('./health.route');
const inviteCandidateRoute = require('./candidate.route');
const pricingPlanRoute = require('./pricingplan.route');
const employerDataRoute = require('./employerData.route');
const interviewScheduleRoute = require('./interviewSchedule.route');
const emailSchedulor = require('../../utils/emailCronService');
const { sendEmail } = require('../../services/email.service');
const tokenSchedular = require('../../utils/tokenCronService');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/systemRoles',
    route: systemRolesRoute,
  },
  {
    path: '/organizations',
    route: organizationRoute,
  },
  {
    path: '/jobRole',
    route: jobRoleRoute,
  },
  {
    path: '/jobOpening',
    route: jobOpeningRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/resumes',
    route: resumesRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/menuAccess',
    route: menuAccessRoute,
  },
  {
    path: '/jobApplicant',
    route: jobApplicantRoute,
  },
    {
    path: '/interviewSchedule',
    route: interviewScheduleRoute,
  },
  {
    path: '/candidate',
    route: inviteCandidateRoute,
  },
  {
    path: '/pricingPlan',
    route: pricingPlanRoute,
  },
  {
    path: '/employerData',
    route: employerDataRoute,
  },
  {
    path: '/',
    route: healthRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

emailSchedulor(sendEmail);
tokenSchedular();

module.exports = router;
