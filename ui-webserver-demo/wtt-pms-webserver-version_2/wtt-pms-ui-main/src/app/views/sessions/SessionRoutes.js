import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const JwtWelcome = Loadable(lazy(() => import('./JwtWelcome')));
// const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));
const CandidateRegister = Loadable(lazy(() => import('./CandidateRegister')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));
const ChangePassword = Loadable(lazy(() => import('./ChangePassword')));
const JobDescription = Loadable(lazy(() => import('../../components/JobDescription/JobDescription')));
const EmailVerified = Loadable(lazy(() => import('./EmailVerified')));
const sessionRoutes = [
  // { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/candidate-signup', element: <CandidateRegister /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/welcome', element: <JwtWelcome /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  { path: '/session/resetpassword', element: <ResetPassword /> },
  { path: '/session/change-password', element: <ChangePassword /> },
  { path: '/jobdescription', element: <JobDescription /> },
  { path: '/session/404', element: <NotFound /> },
  { path: '/session/email-verified', element: <EmailVerified /> }
];

export default sessionRoutes;
