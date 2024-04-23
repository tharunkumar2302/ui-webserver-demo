const faker = require('faker');
const { User } = require('../../../src/models');
const { insertOrganization, organizationOne } = require('../../fixtures/organization.fixture');

describe('User model', () => {
  describe('User validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        firstName: faker.name.findName(),
        lastName: faker.name.findName(),
        designation: 'test',
        mobileNumber: '9867564536',
        emailAddress: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: '63f4612d32d1723c4418769f',
        organization: '63f460fa1ca4b059f86c2446',
      };
    });

    test('should correctly validate a valid user', async () => {
      insertOrganization([organizationOne]);
      const user = new User(newUser).validate();
      await expect(user).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newUser.emailAddress = 'invalidEmail';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
    test('should throw a validation error if mobile number is invalid', async () => {
      newUser.mobileNumber = 'invalidEmail';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain numbers', async () => {
      newUser.password = 'password';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain letters', async () => {
      newUser.password = '11111111';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if role is unknown', async () => {
      newUser.role = 'invalid';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });

  describe('User toJSON()', () => {
    test('should not return user password when toJSON is called', () => {
      const newUser = {
        firstName: faker.name.findName(),
        lastName: faker.name.findName(),
        designation: 'test',
        mobileNumber: '98675647362',
        emailAddress: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user',
      };
      expect(new User(newUser).toJSON()).not.toHaveProperty('password');
    });
  });
});
