const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const config = require('../config/config');
const logger = require('../config/logger');
const EmailQueue = require('../models/emailEnque.model');
const { tokenService } = require('.');
const aws = require('aws-sdk');

const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, bcc, cc, subject, body) => {
  try {
    const msg = {
      from: config.email.from,
      to: to,
      bcc: bcc,
      cc: cc,
      subject: subject,
      template: body.template,
      context: {
        user: body.user?.firstName,
        url: body.url,
        options: body.options,
        emailBody: body.options?.emailbody?.replaceAll('&lt;', '<'),
      },
    };
    await mail().sendMail(msg);
  } catch (error) {
    console.log(error);
  }
};

const mail = () => {
  return transport.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/templates/',
        layoutsDir: 'src/templates/',
        defaultLayout: false,
      },
      viewPath: 'src/templates/',
      extName: '.handlebars',
    })
  );
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
// eslint-disable-next-line camelcase
const sendResetPasswordEmail = async (to, token, user, target_url) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // eslint-disable-next-line camelcase
  const resetPasswordUrl = `${target_url || config.ui.devUrl}${config.ui.resetpassword}?token=${token}`;
  const body = await parseTemplate(resetPasswordUrl,'reset-password/reset-password', user);
  await enQueueEmail(to,subject,body);
};

const sendEmailPassCode = async (to, passcode, user) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  // eslint-disable-next-line camelcase
  const resetPasswordPasscode = passcode;
  const body = await parseTemplate(resetPasswordPasscode, 'reset-password/reset-password-for-mobile', user);
  await enQueueEmail(to, subject, body);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token, user, template = 'sign-up/sign-up') => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.api.baseUrl}api/auth/verify-email?token=${token}`;
  const body = await parseTemplate(verificationEmailUrl, template, user);
  await enQueueEmail(to, subject, body);
};
/**
 * Send recruiter template for created user
 * @param {string} user
 * @param {string} password
 * @returns {Promise}
 */
const sendLoginEmail = async (user, password) => {
  const subject = 'Recruiter Account Created';
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `${config.ui.devUrl + config.ui.login}`;
  const body = await parseTemplate(loginUrl, 'recruiter/recruiter', user, {
    password,
    email: user.emailAddress,
    subject,
  });
  await enQueueEmail(to,subject,body);
};

const sendInviteCandidateEmail = async (to, token, candidateName, recruiterName, targetUrl) => {
  const subject = 'Candidate Invitation';
  // replace this url with the link to the email verification page of your front-end app
  const signUpUrl = `${config.ui.devUrl}${targetUrl}?token=${token}`;
  const body = await parseTemplate(signUpUrl, 'invite-candidate/invite-candidate', '', { candidateName, recruiterName });
  await enQueueEmail(to,subject,body);
};

const sendCandidateAcceptenceEmail = async (to, candidateName, recruiterName) => {
  const subject = 'Candidate Acceptance of Invitation';
  const body = await parseTemplate('','invite-candidate/recruiter-notifier-for-candidateAcceptence', '', { candidateName, recruiterName });
  await enQueueEmail(to,subject,body);
};

const notificationEmail = async (results , req, genToken) =>{
  results.forEach(async (resume) => {
   const resumeToken = await genToken(resume._id ?? resume.id, true);  
   let strUrl = (req.body.body + '').substring(req.body.body.indexOf('href="')+6);
   strUrl = strUrl.substring(0,strUrl.indexOf('"'));   
   const body = await parseTemplate('', 'notification/notifications', '', {emailbody:req.body.body.replaceAll(strUrl, strUrl+"&token="+resumeToken)});
   console.log(req.body.toList,req.body.ccList,[resume.email]);
   enQueueEmail([resume.email],req.body.subject,body ,[req.body.toList], [req.body.ccList]);
  });
};


const googleMeetEmail = async (to,candidateFirstname,AttendeesEmail,organizationName,jobName,meetingLink,date,time,profileData,deleteMsg) => {
  console.log('check!!!');
  const subject = deleteMsg ? `Cancelled: Interaction with ${organizationName} for job opening of ${jobName}` : `Interaction with ${organizationName} for job opening of ${jobName}`;
  const body = await parseTemplate('',deleteMsg ? 'interviewschedule/cancelCandidateInterview' : 'interviewschedule/scheduleCandidateInterview','',{candidateName: candidateFirstname,meetingLink: meetingLink,date:date,startTime:time.start,endTime: time.end,organization: organizationName,job: jobName,profile: profileData});
  await enQueueEmail(to,subject,body,[],AttendeesEmail);
}


const parseTemplate = async (url, templat, user, options = {}) => {
  let obj = {
    url: url,
    template: templat,
    user: user,
    options: options,
  };
  return obj;
};

const enQueueEmail = async (to, subject, body, bcc = '',  AttendeesEmail) => {
  await EmailQueue.deleteOne({toAddress: to})
  var emailEnque = new EmailQueue({
    toAddress: to,
    ccAddress: AttendeesEmail,
    bccAddress: bcc,
    subject: subject,
    body: body,
    processed: false,
    createaddatetime: new Date(),
    processeddatetime: new Date(),
  });

  emailEnque.save();
};
module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendLoginEmail,
  sendEmailPassCode,
  sendInviteCandidateEmail,
  notificationEmail,
  parseTemplate,
  enQueueEmail,
  sendCandidateAcceptenceEmail,
  googleMeetEmail
};
