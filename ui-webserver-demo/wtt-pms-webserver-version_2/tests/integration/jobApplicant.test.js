const { candidateAccessToken, recruiterAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, candidate, recruiter } = require('../fixtures/user.fixture');
const setupTestDB = require('../utils/setupTestDB');
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const mongoose = require('mongoose');
const { insertJobOpening, jobOpening } = require('../fixtures/jobOpenings.fixture');
const { insertJObApplicant, jobApplicant } = require('../fixtures/jobApplicant.fixture');
const { organizationThree } = require('../fixtures/organization.fixture');

setupTestDB();

describe('Job Applicant Route', () => {
  describe('POST /v1/jobApplicant/currentUser', () => {
    beforeEach(() => {
        jobApplicantDetails = {
            comments: "applied for the angular developer",
        }
    })
    test('Should create a new job Applicant if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        jobApplicantDetails.jobApplication = jobOpening._id;
        await insertUsers([candidate]);
      let res = await request(app)
        .post('/v1/jobApplicant/currentUser')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send(jobApplicantDetails)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /v1/jobApplicant/currentUser', () => {
    test('Should get new job Applicant if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        await insertUsers([candidate]);
      let res = await request(app)
        .get('/v1/jobApplicant/currentUser')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('PATCH /v1/jobApplicant/currentUser', () => {
    beforeEach(() => {
        updateBody = {
            comments: "applied for the web developer",
            status: "withDraw"
        }
    })
    test('Should update job Applicant if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        updateBody.jobApplication = jobOpening._id;
        await insertUsers([candidate]);
      let res = await request(app)
        .patch('/v1/jobApplicant/currentUser')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send(updateBody)
        // console.log(res.body);
        .expect(httpStatus.CREATED);
    });
  });


  describe('POST /v1/jobApplicant/', () => {
    beforeEach(() => {
        jobApplicantDetails = {
            comments: "applied for the angular developer",
        }
    })
    test('Should create a new job Applicant if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        await insertUsers([recruiter,candidate]);
        jobApplicantDetails.jobApplication = jobOpening._id;
        jobApplicantDetails.user = candidate._id;
      let res = await request(app)
        .post('/v1/jobApplicant/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(jobApplicantDetails)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /v1/jobApplicant/', () => {
    test('Should get new job Applicant if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        await insertUsers([recruiter]);
      let res = await request(app)
        .get('/v1/jobApplicant/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/jobApplicant/:jobApplicantId', () => {
    test('Should get new job Applicant by passing job Application Id if data is ok', async () => {
        await insertJobOpening([jobOpening],true);
        await insertJObApplicant([jobApplicant],true);
        await insertUsers([recruiter]);
      let res = await request(app)
        .get(`/v1/jobApplicant/${jobApplicant._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('PATCH /v1/jobApplicant/:jobApplicantId', () => {
    beforeEach(() => {
        updateBody = {
            comments: "applied for the web developer",
            status: "processed"
        }
    })
    test('Should update job Applicant by passing job Application Id if data is ok', async () => {
        await insertUsers([recruiter]);
        await insertJobOpening([jobOpening],true);
        await insertJObApplicant([jobApplicant],true);
      let res = await request(app)
        .patch(`/v1/jobApplicant/${jobApplicant._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.CREATED);
    });
  });

  describe('DELETE /v1/jobApplicant/:jobApplicantId', () => {
    test('Should update job Applicant by passing job Application Id if data is ok', async () => {
        await insertUsers([recruiter]);
        await insertJobOpening([jobOpening],true);
        await insertJObApplicant([jobApplicant],true);
      let res = await request(app)
        .delete(`/v1/jobApplicant/${jobApplicant._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });
});
