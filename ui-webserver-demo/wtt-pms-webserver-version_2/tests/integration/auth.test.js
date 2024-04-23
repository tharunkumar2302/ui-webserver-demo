const request = require('supertest');
const httpStatus = require('http-status');
const mongoose = require("mongoose");
const faker = require('faker');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const config = require('../../src/config/config');
const auth = require('../../src/middlewares/auth');
const { tokenService, emailService } = require('../../src/services');
const ApiError = require('../../src/utils/ApiError');
const setupTestDB = require('../utils/setupTestDB');
const { User, Token } = require('../../src/models');
const { tokenTypes } = require('../../src/config/tokens');
const { userOne, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { betweenRandomNumber } = require('../../src/utils/helper');
const { role4, insertRole, roleTwo } = require('../fixtures/systemRole.fixture');
const { insertOrganization, organizationOne } = require('../fixtures/organization.fixture');

setupTestDB();

describe('Auth routes', () => {
  let newUser;
  beforeEach(() => {
    newUser = {
      firstName: 'aaa',
      lastName: 'Dubey',
      designation: 'admin',
      mobileNumber: '9867463526',
      emailAddress: 'a@gmail.com',
      password: 'M@123abcD',
      role: 'employer',
      organizationName: 'WTT',
    };
  });
  describe('POST /v1/auth/register', () => {
    test('should return 201 and successfully register user if request data is ok', async () => {
      await insertRole([role4]);
      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        role: expect.anything(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        designation: newUser.designation,
        mobileNumber: newUser.mobileNumber,
        emailAddress: newUser.emailAddress,
        organization: expect.anything(),
        isEmailVerified: false,
        isActive: true,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        designation: newUser.designation,
        mobileNumber: newUser.mobileNumber,
        emailAddress: newUser.emailAddress,
        isEmailVerified: false,
      });

      expect(res.body.tokens).not.toBeDefined();
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.emailAddress = 'invalidEmail';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertRole([roleTwo]);
      userOne.role = roleTwo._id;
      await insertOrganization([organizationOne]);
      userOne.organization = organizationOne._id;
      await insertUsers([userOne]);
      newUser.emailAddress = userOne.emailAddress;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/login', () => {
    test('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        emailAddress: userOne.emailAddress,
        password: userOne.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        firstName: userOne.firstName,
        lastName: userOne.lastName,
        designation: userOne.designation,
        mobileNumber: userOne.mobileNumber,
        emailAddress: userOne.emailAddress,
        role: expect.anything(),
        organization: expect.anything(),
        isActive: false,
        isEmailVerified: userOne.isEmailVerified,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });
    test('should return 401 and login user if email and password match but email not verified', async () => {
      userOne.isEmailVerified = false;
      await insertUsers([userOne]);
      const loginCredentials = {
        emailAddress: userOne.emailAddress,
        password: userOne.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.FOUND);
      expect(res.body).toEqual({
        code: httpStatus.FOUND,
        message: 'Please verify your email address. Check your mail for the verification link.',
      });
    });

    test('should return 401 error if there are no users with that email', async () => {
      const loginCredentials = {
        emailAddress: userOne.emailAddress,
        password: userOne.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        emailAddress: userOne.emailAddress,
        password: 'wrongPassword1',
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
    });
  });

  describe('POST /v1/auth/logout', () => {
    test('should return 204 if refresh token is valid', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NO_CONTENT);

      const dbRefreshTokenDoc = await Token.findOne({ token: refreshToken });
      expect(dbRefreshTokenDoc).toBe(null);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/v1/auth/logout').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if refresh token is not found in the database', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if refresh token is blacklisted', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH, true);

      await request(app).post('/v1/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /v1/auth/refresh-tokens', () => {
    test('should return 200 and new auth tokens if refresh token is valid', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

      const res = await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.OK);

      expect(res.body).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });

      const dbRefreshTokenDoc = await Token.findOne({ token: res.body.refresh.token });
      expect(dbRefreshTokenDoc).toMatchObject({ type: tokenTypes.REFRESH, user: userOne._id, blacklisted: false });

      const dbRefreshTokenCount = await Token.countDocuments();
      expect(dbRefreshTokenCount).toBe(1);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/v1/auth/refresh-tokens').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if refresh token is signed using an invalid secret', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH, 'invalidSecret');
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is not found in the database', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is blacklisted', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH, true);

      await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is expired', async () => {
      await insertUsers([userOne]);
      const expires = moment().subtract(1, 'minutes');
      const refreshToken = tokenService.generateToken(userOne._id, expires);
      await tokenService.saveToken(refreshToken, userOne._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if user is not found', async () => {
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(userTwo._id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, userTwo._id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/auth/forgot-password', () => {
    beforeEach(() => {
      jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
    });

    test('should return 204 and send reset password email to the user', async () => {
      await insertUsers([userOne]);
      const sendResetPasswordEmailSpy = jest.spyOn(emailService, 'sendResetPasswordEmail');

      await request(app).post('/v1/auth/forgot-password').send({ email: userOne.emailAddress }).expect(httpStatus.OK);

      expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(
        userOne.emailAddress,
        expect.any(String),
        expect.anything(),
        undefined
      );
      const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
      const dbResetPasswordTokenDoc = await Token.findOne({ token: resetPasswordToken, user: userOne._id });
      expect(dbResetPasswordTokenDoc).toBeDefined();
    });

    test('should return 400 if email is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/v1/auth/forgot-password').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if email does not belong to any user', async () => {
      await request(app).post('/v1/auth/forgot-password').send({ email: userOne.emailAddress }).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /v1/auth/reset-password', () => {
    test('should return 204 and reset the password', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password2' })
        .expect(httpStatus.OK);

      const dbUser = await User.findById(userOne._id);
      const isPasswordMatch = await bcrypt.compare('password2', dbUser.password);
      expect(isPasswordMatch).toBe(true);

      const dbResetPasswordTokenCount = await Token.countDocuments({ user: userOne._id, type: tokenTypes.RESET_PASSWORD });
      expect(dbResetPasswordTokenCount).toBe(0);
    });

    test('should return 400 if reset password token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/v1/auth/reset-password').send({ password: 'password2' }).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if reset password token is blacklisted', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD, true);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if reset password token is expired', async () => {
      await insertUsers([userOne]);
      const expires = moment().subtract(1, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if user is not found', async () => {
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 if password is missing or invalid', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);

      await request(app).post('/v1/auth/reset-password').query({ token: resetPasswordToken }).expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'short1' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: '11111111' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/mforgot-password', () => {
    beforeEach(() => {
      jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
    });

    test('should return 204 and send reset password email to the user', async () => {
      await insertUsers([userOne]);
      const sendEmailPassCodeSpy = jest.spyOn(emailService, 'sendEmailPassCode');

      await request(app).post('/v1/auth/mforgot-password').send({ email: userOne.emailAddress }).expect(httpStatus.OK);

      expect(sendEmailPassCodeSpy).toHaveBeenCalledWith(
        userOne.emailAddress,
        expect.any(Number),
        expect.anything(),
        undefined
      );
      const resetPasswordToken = sendEmailPassCodeSpy.mock.calls[0][1];
      const dbResetPasswordTokenDoc = await Token.findOne({ token: resetPasswordToken, user: userOne._id });
      expect(dbResetPasswordTokenDoc).toBeDefined();
    });

    test('should return 400 if email is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/v1/auth/mforgot-password').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if email does not belong to any user', async () => {
      await request(app)
        .post('/v1/auth/mforgot-password')
        .send({ email: userOne.emailAddress })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /v1/auth/change-password', () => {
    test('should return OK and change the password', async () => {
      await insertUsers([userOne]);
      const res = await request(app)
        .post('/v1/auth/change-password')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ oldpassword: 'password1', newpassword: 'password22' })
        .expect(httpStatus.OK);
    });
  });

  describe('POST /v1/auth/deactivate-account', () => {
    const password = 'password1';
    test('should return OK and deactivate the account',async() => {
      await insertUsers([userOne]);
      const res = await request(app)
      .post('/v1/auth/deactivate-account')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        _id: mongoose.Types.ObjectId(),
        firstName: faker.name.findName(),
        lastName: 'Dubey',
        designation: 'admin',
        mobileNumber: '9867463526',
        emailAddress: faker.internet.email().toLowerCase(),
        password,
        role: 'recruiter',
        isActive: false,
        isEmailVerified: true,
      })
      .expect(httpStatus.OK);
    })
  })

  describe('POST /v1/auth/mreset-password', () => {
    test('should return 204 and reset the password', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      const resetPasswordPassCode = await tokenService.generateResetPasswordPasscode(userOne.emailAddress);
      await tokenService.saveToken(
        resetPasswordToken,
        userOne._id,
        expires,
        tokenTypes.RESET_PASSWORD,
        false,
        resetPasswordPassCode.resetPasswordPassCode
      );

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordPassCode.resetPasswordToken, passcode: resetPasswordPassCode.resetPasswordPassCode })
        .send({ password: 'password2' })
        .expect(httpStatus.OK);

      const dbUser = await User.findById(userOne._id);
      const isPasswordMatch = await bcrypt.compare('password2', dbUser.password);
      expect(isPasswordMatch).toBe(true);

      const dbResetPasswordTokenCount = await Token.countDocuments({ user: userOne._id, type: tokenTypes.RESET_PASSWORD });
      expect(dbResetPasswordTokenCount).toBe(0);
    });

    test('should return 400 if reset password token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/v1/auth/mreset-password').send({ password: 'password2' }).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if reset password token is blacklisted', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      const resetPasswordPassCode = betweenRandomNumber(100000, 999999);
      await tokenService.saveToken(
        resetPasswordToken,
        userOne._id,
        expires,
        tokenTypes.RESET_PASSWORD,
        true,
        resetPasswordPassCode
      );

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if reset password token is expired', async () => {
      await insertUsers([userOne]);
      const expires = moment().subtract(1, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      const resetPasswordPassCode = betweenRandomNumber(100000, 999999);
      await tokenService.saveToken(
        resetPasswordToken,
        userOne._id,
        expires,
        tokenTypes.RESET_PASSWORD,
        false,
        resetPasswordPassCode
      );

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if user is not found', async () => {
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      const resetPasswordPassCode = betweenRandomNumber(100000, 999999);
      await tokenService.saveToken(
        resetPasswordToken,
        userOne._id,
        expires,
        tokenTypes.RESET_PASSWORD,
        false,
        resetPasswordPassCode
      );

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: 'password2' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 if password is missing or invalid', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
      const resetPasswordPassCode = betweenRandomNumber(100000, 999999);
      await tokenService.saveToken(
        resetPasswordToken,
        userOne._id,
        expires,
        tokenTypes.RESET_PASSWORD,
        false,
        resetPasswordPassCode
      );

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: 'short1' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: 'password' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/v1/auth/mreset-password')
        .query({ token: resetPasswordToken, passcode: resetPasswordPassCode })
        .send({ password: '11111111' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/send-verification-email', () => {
    beforeEach(() => {
      jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
    });

    test('should return 204 and send verification email to the user', async () => {
      await insertUsers([userOne]);
      const sendVerificationEmailSpy = jest.spyOn(emailService, 'sendVerificationEmail');

      await request(app)
        .post('/v1/auth/send-verification-email')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NO_CONTENT);

      expect(sendVerificationEmailSpy).toHaveBeenCalledWith(userOne.emailAddress, expect.any(String), expect.anything());
      const verifyEmailToken = sendVerificationEmailSpy.mock.calls[0][1];
      const dbVerifyEmailToken = await Token.findOne({ token: verifyEmailToken, user: userOne._id });

      expect(dbVerifyEmailToken).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/v1/auth/send-verification-email').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('Auth middleware', () => {
    test('should call next with no errors if access token is valid', async () => {
      await insertUsers([userOne]);
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user._id).toEqual(userOne._id);
    });

    test('should call next with unauthorized error if access token is not found in header', async () => {
      await insertUsers([userOne]);
      const req = httpMocks.createRequest();
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with unauthorized error if access token is not a valid jwt token', async () => {
      await insertUsers([userOne]);
      const req = httpMocks.createRequest({ headers: { Authorization: 'Bearer randomToken' } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with unauthorized error if the token is not an access token', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
      const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${refreshToken}` } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with unauthorized error if access token is generated with an invalid secret', async () => {
      await insertUsers([userOne]);
      const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
      const accessToken = tokenService.generateToken(userOne._id, expires, tokenTypes.ACCESS, 'invalidSecret');
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with unauthorized error if access token is expired', async () => {
      await insertUsers([userOne]);
      const expires = moment().subtract(1, 'minutes');
      const accessToken = tokenService.generateToken(userOne._id, expires, tokenTypes.ACCESS);
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with unauthorized error if user is not found', async () => {
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
      const next = jest.fn();

      await auth()(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
      );
    });

    test('should call next with forbidden error if user does not have required rights and userId is not in params', async () => {
      await insertUsers([userOne]);
      const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
      const next = jest.fn();

      await auth('anyRight')(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: httpStatus.FORBIDDEN, message: 'Forbidden' }));
    });

    test('should call next with no errors if user does not have required rights but userId is in params', async () => {
      await insertUsers([userOne]);
      const req = httpMocks.createRequest({
        headers: { Authorization: `Bearer ${userOneAccessToken}` },
        params: { userId: userOne._id.toHexString() },
      });
      const next = jest.fn();

      await auth('anyRight')(req, httpMocks.createResponse(), next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
