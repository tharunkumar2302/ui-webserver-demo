const setupTestDB = require('../utils/setupTestDB');
const { admin, insertUsers, userOne, candidate, userTwo } = require('../fixtures/user.fixture');
const request = require('supertest');
const { adminAccessToken, userOneAccessToken, candidateAccessToken } = require('../fixtures/token.fixture');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertRole, role4, roleOne, roleTwo } = require('../fixtures/systemRole.fixture');
const { insertMenuAccess } = require('../fixtures/menuAccess.fixture');
const mongoose = require('mongoose');

setupTestDB();

describe('Menu Access routes', () => {
  let newMenuAccess;
  let menuAccess;
  beforeEach(() => {
    newMenuAccess = {
      screen: ['Dashboard', 'Relvant Jobs', 'My Jobs'],
    };
    menuAccess = {
      screen: ['Dashboard', 'Relvant Jobs', 'My Jobs'],
      role: {
        createdAt: expect.anything(),
        createdByUserId: admin._id.toHexString(),
        description:
          'Administrative Managers help organize schedules and manage payroll and personnel databases. They create reports to offer to other clerical roles. They also set policies and procedures to ensure that staff members are well trained and confident in their abilities.',
        id: expect.anything(),
        isActive: false,
        isDefault: true,
        modifiedAt: expect.anything(),
        modifiedByUserId: admin._id.toHexString(),
        name: 'employer',
      },
      isActive: true,
    };
  });
  describe('POST /v1/menuAccess', () => {
    test('should return 201 and successfully create a menu access if request data is ok', async () => {
      await insertRole([role4]);
      await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/menuAccess')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newMenuAccess)
        .expect(httpStatus.CREATED);
      // expect(res.body).toEqual({menuAccess});
    });
    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/menuAccess').send(newMenuAccess).expect(httpStatus.UNAUTHORIZED);
    });
    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/menuAccess')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newMenuAccess)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/menuAccess', () => {
    let candidateMenuAccess;
    let adminMenuAccess;
    beforeEach(() => {
      candidateMenuAccess = {
        screen: ['Dashboard-c', 'Relvant Jobs', 'Applied Jobs', 'Jobs'],
        role: mongoose.Types.ObjectId(),
      };
      adminMenuAccess = {
        screen: ['Dashboard-c', 'Relvant Jobs', 'Applied Jobs'],
        role: mongoose.Types.ObjectId(),
      };
    });
    test('should return 200 and retrive candidate access screens', async () => {
      const role = await insertUsers([candidate]);
      candidateMenuAccess.role = role._id;
      await insertMenuAccess([candidateMenuAccess]);

      const res = await request(app)
        .get('/v1/menuAccess')
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send()
        .expect(httpStatus.OK);
    });
    //   test('should return 200 and apply the default query options', async () => {
    //     await insertMenuAccess([candidateMenuAccess]);
    //     await insertUsers([candidate]);

    //     const res = await request(app).get('/v1/menuAccess').set('Authorization', `Bearer ${candidateAccessToken}`).send()
    //     expect(res.body).toEqual(['Dashboard-c', 'Relvant Jobs', 'Applied Jobs', 'Jobs'])
    //   });
    test('should return 401 if access token is missing', async () => {
      await insertUsers([candidate]);

      await request(app).get('/v1/menuAccess').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /v1/menuAccess', () => {
    let candidateMenuAccess;
    let updateBody;
    beforeEach(() => {
      candidateMenuAccess = {
        _id: mongoose.Types.ObjectId(),
        screen: ['Dashboard-c', 'Relvant Jobs', 'Applied Jobs', 'Jobs'],
        role: mongoose.Types.ObjectId(),
      };
      updateBody = {
        screen: ['Dashboard-c', 'Relvant Jobs'],
        role: candidateMenuAccess.role,
      };
    });
    test('should return 200 and successfully update menuAccesses if data is ok', async () => {
      await insertUsers([admin]);
      await insertMenuAccess([candidateMenuAccess]);
      let res = await request(app)
        .patch('/v1/menuAccess')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        // console.log(res.body);
        .expect(httpStatus.OK);
    });
    test('should return 401 error if access token is missing', async () => {
      await insertUsers([admin]);
      await insertMenuAccess([candidateMenuAccess]);
      await request(app).patch(`/v1/menuAccess`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });
    test('should return 403 if none-admin user is updating menuAccess', async () => {
      await insertUsers([candidate]);
      await insertMenuAccess([candidateMenuAccess]);
      await request(app)
        .patch(`/v1/menuAccess`)
        .set('Authorization', `Bearer ${candidateAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE /v1/menuAccess', () => {
    let candidateMenuAccess;
    let deleteBody;
    beforeEach(() => {
      candidateMenuAccess = {
        _id: mongoose.Types.ObjectId(),
        screen: ['Dashboard-c', 'Relvant Jobs', 'Applied Jobs', 'Jobs'],
        role: mongoose.Types.ObjectId(),
      };
      deleteBody = {
        screen: ['Dashboard-c', 'Relvant Jobs', 'Applied Jobs', 'Jobs'],
        role: candidateMenuAccess.role,
      };
    });
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertMenuAccess([candidateMenuAccess]);
      let res = await request(app)
        .delete('/v1/menuAccess')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        // console.log(res.body);
        .expect(httpStatus.NO_CONTENT);
    });
  });
});
