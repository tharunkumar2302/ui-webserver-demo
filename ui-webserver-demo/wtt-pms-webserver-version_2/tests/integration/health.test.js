const setupTestDB = require("../utils/setupTestDB");
const httpStatus = require('http-status');
const app = require('../../src/app');
const request = require('supertest');
const { insertUsers, admin } = require("../fixtures/user.fixture");
const { adminAccessToken } = require("../fixtures/token.fixture");

setupTestDB();

describe('HEALTH Route',() => {
    describe('GET v1/',() => {
        test('Should check server status',async () => {
            await insertUsers([admin]);
            await request(app)
            .get('/v1/')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send()
            .expect(httpStatus.OK);
        })
    })
})
