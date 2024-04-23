const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { resume } = require('./resume.fixture');
const { userOne, admin, employer, recruiter, candidate } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);
const employerAccessToken = tokenService.generateToken(employer._id, accessTokenExpires, tokenTypes.ACCESS);
const recruiterAccessToken = tokenService.generateToken(recruiter._id, accessTokenExpires, tokenTypes.ACCESS);
const resumeAccessToken = tokenService.generateToken(resume._id, accessTokenExpires, tokenTypes.ACCESS);
const candidateAccessToken = tokenService.generateToken(candidate._id, accessTokenExpires, tokenTypes.ACCESS);

module.exports = {
  userOneAccessToken,
  adminAccessToken,
  employerAccessToken,
  recruiterAccessToken,
  resumeAccessToken,
  candidateAccessToken,
};
