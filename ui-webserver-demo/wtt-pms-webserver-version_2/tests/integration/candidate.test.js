const request = require('supertest');
const app = require('../../src/app');
const httpStatus = require('http-status');
const setupTestDB = require('../utils/setupTestDB');
const { insertUsers, recruiter, candidate } = require('../fixtures/user.fixture');
const { recruiterAccessToken, resumeAccessToken, candidateAccessToken } = require('../fixtures/token.fixture');
const { resume, insertResume } = require('../fixtures/resume.fixture');

setupTestDB();
describe('candidate route', () => {
  beforeEach(() => {
    inviteData = {
      to: ['shivam.chaudhary@walkingtree.tech', 'chaudharyshivam799@gmail.com'],
      endpointUrl: 'session/signup',
    };
  });

  describe('post v1/candidate/invite', () => {
    test('Should send email to given email-ids if request data is ok', async () => {
      await insertUsers([recruiter]);
      const res = await request(app)
        .post('/v1/candidate/invite')
        .set('Authorization', `Bearer ${recruiterAccessToken}`)
        .send(inviteData)
        .expect(httpStatus.OK);
    });

    test('Should get candidate details', async () => {
      console.log(resumeAccessToken);
      await insertResume([resume]);
      const res = await request(app)
        .get('/v1/candidate/details')
        .query({
          inviteToken: resumeAccessToken,
        })
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get candidate KPI', async () => {
      await insertUsers([candidate]);
      const res = await request(app)
        .get('/v1/candidate/KPI')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });
});
