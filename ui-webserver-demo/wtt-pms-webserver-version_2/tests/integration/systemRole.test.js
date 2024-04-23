const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');

const setupTestDB = require('../utils/setupTestDB');

const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { SystemRole } = require('../../src/models');
const { insertRole, roleTwo, roleOne } = require('../fixtures/systemRole.fixture');

setupTestDB();

describe('SystemRoles routes', () => {
  let newSysRole;
  beforeEach(() => {
    newSysRole = {
      name: faker.name.findName(),
      description: 'test desc',
    };
  });
  describe('POST /v1/systemRoles', () => {
    test('should return 201 and successfully register role if request data is ok', async () => {
      await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/systemRoles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSysRole)
        .expect(httpStatus.CREATED);
      expect(res.body.role).toEqual({
        id: expect.anything(),
        name: newSysRole.name.toLowerCase(),
        description: newSysRole.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: admin._id.toHexString(),
        isActive: true,
        isDefault: false,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      const dbRole = await SystemRole.findById(res.body.role.id);
      expect(dbRole).toBeDefined();
      expect(dbRole).toMatchObject({
        name: newSysRole.name.toLowerCase(),
        description: newSysRole.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: admin._id.toHexString(),
        isActive: true,
        isDefault: false,
      });
    });
    // test('should be able to create an admin as well', async () => {
    //   await insertUsers([admin]);
    //   newSysRole.name = 'admin';

    //   const res = await request(app)
    //     .post('/v1/systemRoles')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newSysRole)
    //     .expect(httpStatus.CREATED);

    //   expect(res.body.role.name).toBe('admin');

    //   const dbUser = await SystemRole.findById(res.body.role.id);
    //   expect(dbUser.name).toBe('admin');
    // });

    test('should return 400 and successfully create new role if role already exists', async () => {
      await insertUsers([admin]);
      await insertRole([roleTwo]);
      newSysRole.name = roleTwo.name;
      await request(app)
        .post('/v1/systemRoles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSysRole)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/systemRoles').send(newSysRole).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/systemRoles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newSysRole)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if role is already exists', async () => {
      await insertUsers([admin]);
      await insertRole([roleTwo]);
      newSysRole.name = roleTwo.name;

      await request(app)
        .post('/v1/systemRoles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newSysRole)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/systemRoles', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertRole([roleTwo]);
      await insertUsers([admin]);

      const res = await request(app)
        .get('/v1/systemRoles')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
    });

    test('should return 401 if access token is missing', async () => {
      await insertRole([roleTwo]);
      await insertUsers([admin]);

      await request(app).get('/v1/systemRoles').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all roles', async () => {
      await insertRole([roleTwo]);
      await insertUsers([userOne]);

      await request(app)
        .get('/v1/systemRoles')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
  });
  describe('GET /v1/systemRoles/:roleId', () => {
    test('should return 200 and the role object if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      const res = await request(app)
        .get(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app).get(`/v1/systemRoles/${roleTwo._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if roleId is not a valid mongo id', async () => {
      await insertUsers([admin]);

      await request(app)
        .get('/v1/systemRoles/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('GET /v1/systemRoles/systemRoleByName/:name', () => {
    test('should return 200 and the role object if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      const res = await request(app)
        .get(`/v1/systemRoles/systemRoleByName/${roleTwo.name}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app).get(`/v1/systemRoles/systemRoleByName/${roleTwo.name}`).send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /v1/systemRoles/:roleId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app)
        .delete(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbSysRole = await SystemRole.findById(roleTwo._id);
      expect(dbSysRole).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app).delete(`/v1/systemRoles/${roleTwo._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non-admin user is trying to delete role', async () => {
      await insertUsers([userOne]);
      await insertRole([roleTwo]);

      await request(app)
        .delete(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete role', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app)
        .delete(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if roleId is not a valid mongo id', async () => {
      await insertUsers([userOne, admin]);
      await insertRole([roleTwo]);

      await request(app)
        .delete('/v1/systemRoles/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/systemRoles/:roleId', () => {
    test('should return 200 and successfully update role if data is ok', async () => {
      await insertUsers([admin]);
      await insertRole([roleTwo]);
      const updateBody = {
        name: faker.name.findName(),
        description: 'test desc',
      };

      const res = await request(app)
        .patch(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)

        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: roleTwo._id.toHexString(),
        name: updateBody.name.toLowerCase(),
        description: updateBody.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: roleTwo.createdByUserId,
        isActive: false,
        isDefault: false,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      const dbrole = await SystemRole.findById(roleTwo._id);
      expect(dbrole).toBeDefined();
      expect(dbrole).toMatchObject({
        name: updateBody.name.toLowerCase(),
        description: updateBody.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: roleTwo.createdByUserId,
        isActive: false,
        isDefault: false,
      });
    });
    test('should return 200 and updated the description', async () => {
      await insertUsers([admin]);
      await insertRole([roleTwo]);
      const updateBody = {
        description: 'test desc',
      };

      await request(app)
        .patch(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });
    // test('should return 302 Found if the role is default role.', async () => {
    //   await insertUsers([admin]);
    //   await insertRole([roleTwo]);
    //   const updateBody = {
    //     description: 'test desc',
    //   };

    //   await request(app)
    //     .patch(`/v1/systemRoles/${roleTwo._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(updateBody)
    //     .expect(httpStatus.FOUND);
    // });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([admin]);
      await insertRole([roleTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app).patch(`/v1/systemRoles/${roleTwo._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if none-admin user is updating role', async () => {
      await insertUsers([userOne]);
      await insertRole([roleTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/systemRoles/${roleTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if roleId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/systemRoles/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
