// const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
// const config = require('../config/config');
// const logger = require('../config/logger');
// const { parseTemplate, enQueueEmail } = require('./email.service');

// const transport = nodemailer.createTransport(config.email.smtp);

// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email notification server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

// const sendEmail = async (to, bcc, cc, subject, body) => {
//   const notificationMsg = {
//     from: config.email.from,
//     to: to,
//     bcc: bcc,
//     cc: cc,
//     subject: subject,
//     template: 'notification/notifications',
//     context: {
//       emailBody: body.replaceAll('&lt;', '<'),
//     },
//   };
//   await mail().sendMail(notificationMsg);
// };

// const mail = () => {
//   return transport.use(
//     'compile',
//     hbs({
//       viewEngine: {
//         extName: '.handlebars',
//         partialsDir: 'src/templates/',
//         layoutsDir: 'src/templates/',
//         defaultLayout: false,
//       },
//       viewPath: 'src/templates/',
//       extName: '.handlebars',
//     })
//   );
// };

// const notificationEmail = async (to, bcc, cc, subject, emailbody) => {
//   // await sendEmail(to, bcc, cc, subject, body);
//   const body = await parseTemplate('', 'notification/notifications', '', {emailbody});
//   enQueueEmail(to,subject,body,bcc,cc)
// };

// module.exports = { notificationEmail };
