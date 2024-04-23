const faker = require('faker');
const { SystemRole } = require('../../../src/models');

describe('SystemRole model', () => {
  describe('SystemRole validation', () => {
    let newSysRole;
    beforeEach(() => {
      newSysRole = {
        name: faker.name.findName(),
        designation: 'test desc',
        modifiedByUserId: '63e4f686548fa41ea8beb08d',
        createdByUserId: '63e4f686548fa41ea8beb08d',
      };
    });

    test('should correctly validate a valid SystemRole', async () => {
      const role = new SystemRole(newSysRole).validate();
      await expect(role).resolves.toBeUndefined();
    });
    test('should throw a validation error if SystemRole is null', async () => {
      newSysRole.name = null;
      await expect(new SystemRole(newSysRole).validate()).rejects.toThrow();
    });
    test('should not throw a validation error if modifiedByUserId is null', async () => {
      newSysRole.modifiedByUserId = null;
      await expect(new SystemRole(newSysRole).validate()).resolves.toBeUndefined();
    });
    test('should throw a validation error if createdByUserId is null', async () => {
      newSysRole.createdByUserId = null;
      await expect(new SystemRole(newSysRole).validate()).resolves.toBeUndefined();
    });
  });
});
