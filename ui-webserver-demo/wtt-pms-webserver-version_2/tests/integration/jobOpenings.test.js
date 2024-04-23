const { insertJobOpening, jobOpening } = require('../fixtures/jobOpenings.fixture');
const { candidateAccessToken, recruiterAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, candidate, recruiter } = require('../fixtures/user.fixture');
const setupTestDB = require('../utils/setupTestDB');
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertResume, resume } = require('../fixtures/resume.fixture');
const mongoose = require('mongoose');
const { insertJobRole, jobRole } = require('../fixtures/jobRole.fixture');

setupTestDB();

describe('Job Openings Route', () => {
  describe('GET v1/jobOpening/relevantjobs', () => {
    test('Should get relevent jobs of current user', async () => {
      await insertResume([resume], true);
      candidate.resume = resume._id;
      await insertUsers([candidate]);
      await insertJobOpening([jobOpening], true);
      const res = await request(app)
        .get('/v1/jobOpening/relevantjobs')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get NOT_FOUND Error if no resume id for current user', async () => {
      await insertResume([resume], true);
      delete candidate.resume;
      await insertUsers([candidate]);
      await insertJobOpening([jobOpening], true);
      const res = await request(app)
        .get('/v1/jobOpening/relevantjobs')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST v1/jobOpening/', () => {
    let jobOpeningData;
    beforeEach(() => {
      jobOpeningData = {
        department: 'Testing',
        industryType: 'IT',
        responsibilities: 'Web Testing',
        skillsRequired: 'Automation',
        description: 'test application',
        qualification: 'B.tech',
        location: ['Agra'],
        minExperience: 2,
        maxExperience: 5,
        employmentType: 'full time',
        duration: '2 months',
        workMode: 'work from office',
        status: 'Draft',
        tags: ['Html', 'css'],
      };
    });
    test('Should create new job Openings if data is ok', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      jobOpeningData.jobRole = jobRole._id;
      const res = await request(app)
        .post('/v1/jobOpening/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(jobOpeningData)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /v1/jobOpening/', () => {
    test('Should get jobopenings if data is ok', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      const res = await request(app)
        .get('/v1/jobOpening/')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/jobOpening/:jobOpeningId', () => {
    test('Should get jobopenings data by passing job opening id if data is ok', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      await insertJobOpening([jobOpening],true);
      const res = await request(app)
        .get(`/v1/jobOpening/${jobOpening._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get NOT_FOUND Error if role is not found', async () => {
        await insertUsers([recruiter]);
        await insertJobRole([jobRole], true);
        const res = await request(app)
          .get(`/v1/jobOpening/${jobOpening._id}`)
          .set('Authorization', `Bearer ${recruiterAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
  });

  describe('PATCH /v1/jobOpening/:jobOpeningId', () => {
    let updateBody;
    beforeEach(() => {
        updateBody = {
            department: 'Development',
            industryType: 'IT',
            responsibilities: 'Web Developer',
            skillsRequired: 'HTML',
            description: 'develop application',
            qualification: 'B.tech',
            location: ['Agra'],
            minExperience: 2,
            maxExperience: 5,
            employmentType: 'full time',
            duration: '2 months',
            workMode: 'work from office',
            status: 'Draft',
            tags: ['Html', 'css','js'],
        }
    })
    test('Should update jobopenings data by passing job opening id if data is ok', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      await insertJobOpening([jobOpening],true);
      const res = await request(app)
        .patch(`/v1/jobOpening/${jobOpening._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });
  });

  describe('DELETE /v1/jobOpening/:jobOpeningId', () => {
    test('Should delete jobopenings data by passing job opening id if data is ok', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      await insertJobOpening([jobOpening],true);
      const res = await request(app)
        .delete(`/v1/jobOpening/${jobOpening._id}`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('POST /v1/jobOpening/filter', () => {
    let filterBody;
    beforeEach(() => {
        filterBody = {
            keyword: 'HTML'
      };
    });
    test('Should filter jobopenings data by passing keyword', async () => {
      await insertUsers([recruiter]);
      await insertJobRole([jobRole], true);
      await insertJobOpening([jobOpening],true);
      const res = await request(app)
        .post(`/v1/jobOpening/filter`)
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(filterBody)
        .expect(httpStatus.OK);
    });

    test('Should get NOT_FOUND Error if resume is not found', async () => {
        delete recruiter.resume;
        await insertUsers([recruiter]);
        await insertJobRole([jobRole], true);
        await insertJobOpening([jobOpening],true);
        const res = await request(app)
          .post(`/v1/jobOpening/filter`)
          .set('Authorization', `Bearer ${recruiterAccessToken}`)
          .send(filterBody)
          .expect(httpStatus.OK);
      });
  });
});
