const app = require('../../src/app');
const request = require('supertest');
const { insertUsers, recruiter } = require('../fixtures/user.fixture');
const httpStatus = require('http-status');
const setupTestDB = require('../utils/setupTestDB');
const { recruiterAccessToken } = require('../fixtures/token.fixture');

setupTestDB();
describe('Notification routes', () => {
  let notification;
  beforeEach(() => {
    notification = {
      JobOpeningId: 'ghvhcf76ghvhgjnm',
      bccList: ['fake@gmail.com'],
      ccList: ['fake@gmail.com'],
      subject: 'fake subject',
      body: 'fake body',
    };
  });
  describe('POST /v1/notification', () => {
    test('should return 201 and if email created successfully', async () => {
      await insertUsers([recruiter]);
      const res = await request(app)
        .post('/v1/notification')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(notification)
        .expect(httpStatus.CREATED);
      expect(res.body).toEqual({ message: 'Please check your mail inbox' });
    });
  });
});
