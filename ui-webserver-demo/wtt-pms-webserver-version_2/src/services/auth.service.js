const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { sendVerificationEmail } = require('./email.service');
const bcrypt = require('bcryptjs');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  } else if(user.isActive == false) {
    throw new ApiError(httpStatus.FOUND, 'Account is deactivated.please contact to your organisation Administrator');
  }
  else if (!user.isEmailVerified) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await sendVerificationEmail(user.emailAddress, verifyEmailToken, user);
    throw new ApiError(httpStatus.FOUND, 'Please verify your email address. Check your mail for the verification link.');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const changepassword = async (user, oldPassword, newPassword) => {
  const userEmail = await userService.getUserByEmail(user.emailAddress);
  if (!(await userEmail.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password');
  } else if (newPassword.length < 6) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password should be more than 6 digits');
  } else if (!newPassword.match(/\d/) || !newPassword.match(/[a-zA-Z]/)) {
    throw new Error('Password must contain at least one letter and one number');
  } else if (newPassword.length >= 6) {
    const newPass = newPassword;
    userEmail['password'] = newPass;
    userEmail.save();
  }

  return userEmail;
};

const mResetPassword = async (resetPasswordToken, resetPasswordPassCode, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD,
      resetPasswordPassCode
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found Please Try again!!');
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const code = await userService.updateUserById(user.id, { isEmailVerified: true,status: "Verified" });
    return code;
  } catch (error) {
    return httpStatus.UNAUTHORIZED;
  }
};

const deleteAccount = async(user) => {
  if(user && user.isActive) {
  user['isActive'] = false;
  user.save();
  return 'Account deactivated Successfully!!';
  }
  else {
    return 'account is already deactivated!!';
  }
}

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  mResetPassword,
  changepassword,
  deleteAccount
};
