const Joi = require('joi');
const { password, mobileNumber } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    designation: Joi.string().required(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    password: Joi.string().custom(password),
    organizationName: Joi.string().required(),
    role: Joi.string(),
    pricingPlan: Joi.string(),
    inviteToken: Joi.string(),
  }),
};

const registerEmployer = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    designation: Joi.string().required(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    password: Joi.string().custom(password),
    organizationName: Joi.string().required(),
    role: Joi.string(),
    status: Joi.string().required(),
    pricingPlan: Joi.string().required(),
    inviteToken: Joi.string(),
  }),
}

const login = {
  query: Joi.object().keys({
    isMobile: Joi.string(),
  }),
  body: Joi.object().keys({
    emailAddress: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    targetUrl: Joi.string(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const mResetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    passcode: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const changePassword = {
  token: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
}

module.exports = {
  register,
  registerEmployer,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  mResetPassword,
  changePassword
};
