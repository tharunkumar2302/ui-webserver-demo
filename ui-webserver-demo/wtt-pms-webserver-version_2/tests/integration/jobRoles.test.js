const { insertJobRole, jobRole } = require('../fixtures/jobRole.fixture');
const { insertUsers, recruiter } = require('../fixtures/user.fixture');
const setupTestDB = require('../utils/setupTestDB');
const httpStatus = require('http-status');
const app = require('../../src/app');
const request = require('supertest');
const { recruiterAccessToken } = require('../fixtures/token.fixture');
const mongoose = require('mongoose');

setupTestDB();

describe('Job Roles Routes', () => {
  describe('POST /v1/jobRole/', () => {
    beforeEach(() => {
      jobRolesDetails = {
        name: 'Automation Engineer',
        description: 'Take care the automation part',
      };
    });
    test('Should create new job Role if data is ok', async () => {
      await insertUsers([recruiter]);
      let res = await request(app)
        .post('/v1/jobRole/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(jobRolesDetails)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /v1/jobRole/', () => {
    test('Should get job Role if data is ok', async () => {
      await insertUsers([recruiter]);
      let res = await request(app)
        .get('/v1/jobRole/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/jobRole/:roleId', () => {
    test('Should get job Role by passing role Id and if data is ok', async () => {
      await insertJobRole([jobRole],true);
      await insertUsers([recruiter]);
      let res = await request(app)
        .get(`/v1/jobRole/${jobRole._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get NOT_FOUND Error if role Id is not found', async () => {
        await insertUsers([recruiter]);
        let res = await request(app)
          .get(`/v1/jobRole/${jobRole._id}`)
          .set('Authorization', `Bearer ${recruiterAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
  });

  describe('PATCH /v1/jobRole/:roleId', () => {
    let updateBody;
    beforeEach(() => {
        updateBody = {
            name: 'Automation Engineer',
            description: 'Take care the automation part',
        }
    })
    test('Should get job Role by passing role Id and if data is ok', async () => {
      await insertJobRole([jobRole],true);
      await insertUsers([recruiter]);
      let res = await request(app)
        .patch(`/v1/jobRole/${jobRole._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });
  });

  describe('DELETE /v1/jobRole/:roleId', () => {
    test('Should get job Role by passing role Id and if data is ok', async () => {
      await insertJobRole([jobRole],true);
      await insertUsers([recruiter]);
      let res = await request(app)
        .delete(`/v1/jobRole/${jobRole._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });
});
