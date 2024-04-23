const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');

const setupTestDB = require('../utils/setupTestDB');

const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { Organization } = require('../../src/models');
const { insertOrganization, organizationOne, organizationTwo } = require('../fixtures/organization.fixture');

setupTestDB();

describe('organizations routes', () => {
  let newOrg;
  beforeEach(() => {
    newOrg = {
      name: faker.name.findName(),
      description: 'test desc',
    };
  });
  describe('POST /v1/organizations', () => {
    test('should return 201 and successfully register Organization if request data is ok', async () => {
      await insertUsers([admin]);
      const res = await request(app)
        .post('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrg)
        .expect(httpStatus.CREATED);
      expect(res.body.organization).toEqual({
        id: expect.anything(),
        name: newOrg.name,
        description: newOrg.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: admin._id.toHexString(),
        isActive: true,
        isDefault: false,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      const dbRole = await Organization.findById(res.body.organization.id);
      expect(dbRole).toBeDefined();
      expect(dbRole).toMatchObject({
        name: newOrg.name,
        description: newOrg.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: admin._id.toHexString(),
        isActive: true,
        isDefault: false,
      });
    });
    test('should be able to create an admin as well', async () => {
      await insertUsers([admin]);
      newOrg.name = 'admin';

      const res = await request(app)
        .post('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrg)
        .expect(httpStatus.CREATED);

      expect(res.body.organization.name).toBe('admin');

      const dbUser = await Organization.findById(res.body.organization.id);
      expect(dbUser.name).toBe('admin');
    });

    test('should return 400 and successfully create new organization if organization already exists', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne]);
      newOrg.name = organizationOne.name;
      await request(app)
        .post('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrg)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/organizations').send(newOrg).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/organizations')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrg)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if organization is already exists', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationTwo]);
      newOrg.name = organizationTwo.name;

      await request(app)
        .post('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrg)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/organizations', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[1]).toEqual({
        id: organizationOne._id.toHexString(),
        name: organizationOne.name,
        description: organizationOne.description,
        modifiedByUserId: null,
        createdByUserId: null,
        isActive: false,
        isDefault: true,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app).get('/v1/organizations').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all Organizations', async () => {
      await insertUsers([userOne, admin]);

      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: organizationOne.name })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(organizationOne._id.toHexString());
    });
    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[1].id).toBe(organizationOne._id.toHexString());
      expect(res.body.results[2].id).toBe(organizationTwo._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'name:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[1].id).toBe(organizationOne._id.toHexString());
      expect(res.body.results[2].id).toBe(organizationTwo._id.toHexString());
    });
    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 1,
        totalPages: 3,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(organizationOne._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get('/v1/organizations')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 3, limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 3,
        limit: 1,
        totalPages: 3,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(organizationTwo._id.toHexString());
    });
  });
  describe('GET /v1/organizations/:organizationId', () => {
    test('should return 200 and the Organization object if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get(`/v1/organizations/${organizationOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: organizationOne._id.toHexString(),
        name: organizationOne.name,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
        isDefault: organizationOne.isDefault,
        isActive: organizationOne.isActive,
        description: organizationOne.description,
        modifiedByUserId: organizationOne.modifiedByUserId,
        createdByUserId: organizationOne.createdByUserId,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app).get(`/v1/organizations/${organizationOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if OrganizationId is not a valid mongo id', async () => {
      await insertUsers([admin]);

      await request(app)
        .get('/v1/organizations/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if Organization is not found', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne]);
      await request(app)
        .get(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
  describe('GET /v1/organizations/organizationByName/:name', () => {
    test('should return 200 and the Organization object if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      const res = await request(app)
        .get(`/v1/organizations/organizationByName/${organizationOne.name}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: organizationOne._id.toHexString(),
        name: organizationOne.name,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
        isDefault: organizationOne.isDefault,
        isActive: organizationOne.isActive,
        description: organizationOne.description,
        modifiedByUserId: organizationOne.modifiedByUserId,
        createdByUserId: organizationOne.createdByUserId,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .get(`/v1/organizations/organizationByName/${organizationOne.name}`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if Organization is not found', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne]);
      await request(app)
        .get(`/v1/organizations/organizationByName/${organizationTwo.name}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/organizations/:organizationId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .delete(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbSysRole = await Organization.findById(organizationTwo._id);
      expect(dbSysRole).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app).delete(`/v1/organizations/${organizationOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if non-admin user is trying to delete Organization', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .delete(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 204 if admin is trying to delete Organization', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .delete(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 400 error if organizationId is not a valid mongo id', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne, organizationTwo]);

      await request(app)
        .delete('/v1/organizations/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if user try to delete Organization with invalid Organization id', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationTwo]);

      await request(app)
        .delete(`/v1/organizations/${organizationOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if Organization not found', async () => {
      await insertUsers([userOne, admin]);
      await insertOrganization([organizationOne]);

      await request(app)
        .delete(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/organizations/:OrganizationId', () => {
    test('should return 200 and successfully update Organization if data is ok', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);
      const updateBody = {
        name: faker.name.findName(),
        description: 'test desc',
      };

      const res = await request(app)
        .patch(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)

        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: organizationTwo._id.toHexString(),
        name: updateBody.name,
        description: updateBody.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: organizationTwo.createdByUserId,
        isActive: false,
        isDefault: false,
        createdAt: expect.anything(),
        modifiedAt: expect.anything(),
      });

      const dbOrganization = await Organization.findById(organizationTwo._id);
      expect(dbOrganization).toBeDefined();
      expect(dbOrganization).toMatchObject({
        name: updateBody.name,
        description: updateBody.description,
        modifiedByUserId: admin._id.toHexString(),
        createdByUserId: organizationTwo.createdByUserId,
        isActive: false,
        isDefault: false,
      });
    });
    test('should return 200 and updated the description', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);
      const updateBody = {
        description: 'test desc',
      };

      await request(app)
        .patch(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app).patch(`/v1/organizations/${organizationOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if none-admin user is updating Organization', async () => {
      await insertUsers([userOne]);
      await insertOrganization([organizationOne, organizationTwo]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if admin is updating Organization that is not found', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne]);

      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if OrganizationId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/organizations/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if Organization is already exists', async () => {
      await insertUsers([admin]);
      await insertOrganization([organizationOne, organizationTwo]);
      const updateBody = { name: organizationOne.name };

      await request(app)
        .patch(`/v1/organizations/${organizationTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
