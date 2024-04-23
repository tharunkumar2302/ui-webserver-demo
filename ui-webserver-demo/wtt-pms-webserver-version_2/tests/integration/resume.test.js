const setupTestDB = require('../utils/setupTestDB');
const { admin, insertUsers, userOne, candidate, userTwo, employer } = require('../fixtures/user.fixture');
const request = require('supertest');
const {
  adminAccessToken,
  userOneAccessToken,
  candidateAccessToken,
  employerAccessToken,
} = require('../fixtures/token.fixture');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertRole, role4, roleOne, roleTwo } = require('../fixtures/systemRole.fixture');
const { insertMenuAccess } = require('../fixtures/menuAccess.fixture');
const mongoose = require('mongoose');
const { insertResume, resume } = require('../fixtures/resume.fixture');
const { organizationThree, organizationTwo } = require('../fixtures/organization.fixture');
const { resumeService, userService } = require('../../src/services');

setupTestDB();

describe('Resume Routes', () => {
  describe('GET /v1/resumes/kpi', () => {
    test('Should get 200 & resume details if request data is ok', async () => {
      const role = await insertUsers([admin]);
      admin.role = role._id;
      admin.organization = organizationThree._id;
      resume.organization = organizationThree._id;
      await insertResume([resume], true);
      await resumeService.updateResumeView(admin || {});
      const res = await request(app)
        .get('/v1/resumes/kpi')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('POST v1/resumes', () => {
    beforeEach(() => {
      resumeDetails = {
        firstName: 'Shivam',
        lastName: 'Chaudhary',
        email: 'shivam@gmail.com',
        phone_no: '9646787678',
        current_location: 'Agra',
        source: 'MANUAL-RECRUITER',
        status: 'Published',
      };
    });
    test('Should create a resume if data is ok', async () => {
      await insertUsers([employer]);
      await request(app)
        .post('/v1/resumes')
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send(resumeDetails)
        .expect(httpStatus.CREATED);
    });

    test('Should create a resume if data is ok', async () => {
      await insertUsers([employer]);
      await request(app)
        .get('/v1/resumes')
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('GET v1/resumes', () => {
    test('Should get a resume data if data is ok', async () => {
      delete employer.organization;
      await insertUsers([employer]);
      await request(app)
        .get('/v1/resumes')
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('GET v1/resumes/searchFilter', () => {
    beforeEach(() => {
      resumeDetails = {
        firstName: 'Shivam',
        lastName: 'Chaudhary',
        email: 'shivam@gmail.com',
        phone_no: '9646787678',
        current_location: 'Agra',
        source: 'MANUAL-RECRUITER',
        status: 'Published',
        primary_skill: ['flutter'],
      };
    });

    test('Should fliter resume data by passing keyword if data is ok', async () => {
      await insertUsers([employer]);
      let res = await request(app)
        .get(`/v1/resumes/searchFilter?keyword=flutter`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('POST v1/resumes/searchFilter', () => {
    beforeEach(() => {
      resumeDetails = {
        firstName: 'Shivam',
        lastName: 'Chaudhary',
        email: 'shivam@gmail.com',
        phone_no: '9646787678',
        current_location: 'Agra',
        source: 'MANUAL-RECRUITER',
        status: 'Published',
        primary_skill: ['flutter'],
      };
      filters = {
        skills: ['HTML'],
      };
    });
    test('Should fliter resume data by passing filter body if data is ok', async () => {
      await insertUsers([employer]);
      let res = await request(app)
        .post('/v1/resumes/searchFilter')
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send({ filters })
        .expect(httpStatus.OK);
    });

    test('Should export fliter resume data by passing filter body if data is ok', async () => {
      await insertUsers([employer]);
      await insertResume([resume], true);
      let res = await request(app)
        .post('/v1/resumes/searchFilter')
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send({ filters, export: true })
        .expect(httpStatus.OK);
    });
  });

  describe('GET /v1/resumes/:_id', () => {
    test('Should get resume if data is ok', async () => {
      await insertUsers([employer]);
      await insertResume([resume], true);
      let res = await request(app)
        .get(`/v1/resumes/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get NOT_FOUND Error if resume is not uploaded', async () => {
      delete employer.resume;
      await insertUsers([employer]);
      let res = await request(app)
        .get(`/v1/resumes/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH v1/resumes/:_id', () => {
    test('Should update resume of given Id if data is ok', async () => {
      await insertUsers([employer]);
      await insertResume([resume], true);
      const updateBody = {
        firstName: 'Shiva',
        lastName: 'kumar',
        email: 'shiva@gmail.com',
        phone_no: '9646787676',
        current_location: 'Agra',
        status: 'Published',
      };
      let res = await request(app)
        .patch(`/v1/resumes/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });
  });

  describe('DELETE v1/resumes/:_id', () => {
    test('Should delete resume of given Id if data is ok', async () => {
      await insertUsers([employer]);
      await insertResume([resume], true);
      let res = await request(app)
        .delete(`/v1/resumes/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /v1/resumes/downloadresume/:_id', () => {
    test('Should download resume if data is ok', async () => {
      await insertUsers([employer]);
      await insertResume([resume], true);
      let res = await request(app)
        .get(`/v1/resumes/downloadresume/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        // console.log(res.body);
        .expect(httpStatus.OK);
    });

    test('Should give error in downloading resume if resume is not uploded', async () => {
      await insertUsers([employer]);
      // await insertResume([resume], true);
      let res = await request(app)
        .get(`/v1/resumes/downloadresume/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        // console.log(res.body);
        .expect(httpStatus.NOT_FOUND);
    });

    test('Should give error in downloading resume if resume file path is not found', async () => {
      await insertUsers([employer]);
      delete resume.file_path;
      await insertResume([resume], true);
      let res = await request(app)
        .get(`/v1/resumes/downloadresume/${resume._id}`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        // console.log(res.body);
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/resumes/importTemplate', () => {
    test('Should import template if given data is ok', async () => {
      await insertUsers([employer]);
      let res = await request(app)
        .get(`/v1/resumes/importTemplate`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
  });

  describe('POST /v1/resumes/uploads3', () => {
    test('Should upload resume on FTP if data is ok',async () => {
      await insertResume([resume], true);
      await insertUsers([employer]);
            let res = await request(app)
        .post(`/v1/resumes/uploads3`)
        .set('Authorization', `Bearer ${employerAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    })
  })

  describe('POST /v1/resumes/currentuser', () => {
    beforeEach(() => {
      resumeDetails = {
        firstName: 'Shivam',
        lastName: 'Chaudhary',
        email: 'shivam@gmail.com',
        phone_no: '9646787678',
        current_location: 'Agra',
        source: 'MANUAL-RECRUITER',
        status: 'Published',
      };
    });
    test('Should get 201 & resume details if request data is ok', async () => {
      const role = await insertUsers([admin]);
      admin.role = role._id;
      admin.organization = organizationThree._id;
      resume.organization = organizationThree._id;
      await insertResume([resume], true);
      await resumeService.updateResumeView(admin || {});
      const res = await request(app)
        .post('/v1/resumes/currentuser')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(resumeDetails)
        .expect(httpStatus.CREATED);
    });

    test('Should get 403 if resume is already uploaded', async () => {
      admin.resume = resume._id;
      const role = await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/resumes/currentuser')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(resumeDetails)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('PATCH /v1/resumes/currentuser', () => {
    test('should return 200 and successfully update resume if data is ok', async () => {
      admin.resume = resume._id;
      const role = await insertUsers([admin]);
      admin.role = role._id;
      admin.organization = organizationThree._id;
      resume.organization = organizationThree._id;
      await insertResume([resume], true);
      //    await resumeService.updateResumeView(admin || {});
      const updateBody = {
        firstName: 'Shiva',
        lastName: 'kumar',
        email: 'shiva@gmail.com',
        phone_no: '9646787676',
        current_location: 'Agra',
        status: 'Published',
      };
      const res = await request(app)
        .patch(`/v1/resumes/currentuser`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        // console.log(res.body);
        .expect(httpStatus.OK);
    });

    test('should return 403 if resume is not uploaded', async () => {
      delete admin.resume;
      const role = await insertUsers([admin]);

      admin.role = role._id;
      admin.organization = organizationThree._id;
      resume.organization = organizationThree._id;
      await insertResume([resume], true);
      //    await resumeService.updateResumeView(admin || {});
      const updateBody = {
        firstName: 'Shiva',
        lastName: 'kumar',
        email: 'shiva@gmail.com',
        phone_no: '9646787676',
        current_location: 'Agra',
        status: 'Published',
      };
      const res = await request(app)
        .patch(`/v1/resumes/currentuser`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        // console.log(res.body);
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/resumes/currentuser', () => {
    test('Should get resume if request data is ok', async () => {
      resume.organization = organizationThree._id;
      await insertResume([resume], true);
      admin.resume = resume._id;
      const role = await insertUsers([admin]);
      admin.role = role._id;
      admin.organization = organizationThree._id;
      //    await resumeService.updateResumeView(admin || {});
      const res = await request(app)
        .get('/v1/resumes/currentuser')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });

    test('Should get 404 Error and if resume is not uploaded', async () => {
      const role = await insertUsers([admin]);
      admin.role = role._id;
      admin.organization = organizationThree._id;
      const res = await request(app)
        .get('/v1/resumes/currentuser')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
