const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test', 'qa', 'local', 'uat','demo').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(2880)
      .description('minutes after which verify email token expires'),
    SMTP_SERVICE: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.string().description('server that will send the emails'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    AWS_AccessKeyId: Joi.string().description('aws accesskey for s3 bucket'),
    AWS_SecretAccessKey: Joi.string().description('aws secretaccesskey for s3 bucket'),
    AWS_Bucket: Joi.string().description('aws s3 bucket name'),
    AWS_Region: Joi.string().description('aws s3 bucket Region'),
    S3_Folder: Joi.string().description('aws s3 folder in s3 bucket'),
    Private_Key: Joi.string().description('The private key that is used to sign the authentication token.'),
    Client_Email: Joi.string().description('The email address of the service account that is authorized to access the Google APIs.'),
    GoogleDrive_Folder_Id: Joi.string().description('Specifies the drive folder id'),
    Upload_Profiles_To_GoogleDrive: Joi.string().description('Specifies global variable true or false')
  })
  .unknown();

switch (process.env.NODE_ENV) {
  case 'development':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/dev.env') });
    break;
  case 'test':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/test.env') });
    break;
  case 'qa':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/qa.env') });
    break;
  case 'production':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/.env') });
    break;
  case 'local':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/local.env') });
    break;
  case 'uat':
    dotenv.config({ path: path.join(__dirname, '../../envFiles/uat.env') });
    break;
    case 'demo':
      dotenv.config({ path: path.join(__dirname, '../../envFiles/demo.env') });
      break;
  default:
    dotenv.config({ path: path.join(__dirname, '../../envFiles/.env') });
}

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  ui: {
    devUrl: envVars.DEV_UI_URL,
    login: envVars.DEV_LOGIN_ENDPOINT,
    resetpassword: envVars.DEV_RESETPASSWORD_ENDPOINT,
    verifyEmailSuccessfull: envVars.DEV_VERIFY_EMAIL_SUCCESSFULL_ENDPOINT,
    verifyRecruiterEmailSuccessfull: envVars.DEV_VERIFY_RECRUITER_EMAIL_SUCCESSFULL_ENDPOINT,
    verifyEmailError: envVars.DEV_VERIFY_EMAIL_ERROR_ENDPOINT,
    defaultUserPass: envVars.DEFAULT_PASSWORD,
    defaultEmployerPass: envVars.DEFAULT_EMPLOYER_PASSWORD
  },
  api: {
    baseUrl: envVars.API_BASE_URL,
  },
  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    inviteExpirationMinutes: envVars.JWT_INVITE_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_SERVICE,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  AWSconfig: {
    accesskey: envVars.AWS_AccessKeyId,
    secretAccesskey: envVars.AWS_SecretAccessKey,
    s3bucket: envVars.AWS_Bucket,
    region: envVars.AWS_Region,
    s3folder: envVars.S3_Folder
  },
  GoogleDriveconfig: {
    private_key: envVars.Private_Key,
    client_email: envVars.Client_Email,
    GoogleDrive_Folder_Id:envVars.GoogleDrive_Folder_Id,
    Upload_Profiles_To_GoogleDrive : envVars.Upload_Profiles_To_GoogleDrive
  },
};
