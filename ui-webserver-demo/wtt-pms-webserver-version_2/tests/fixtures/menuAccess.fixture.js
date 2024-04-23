const mongoose = require('mongoose');
const { MenuAccess } = require('../../src/models');

const menuAccess = {
  _id: mongoose.Types.ObjectId(),
  role: mongoose.Types.ObjectId(),
  screen: ['Dashboard', 'Relvant Jobs', 'My Jobs'],
  isActive: true,
};

const insertMenuAccess = async (data) => {
  // await insertOrganization([organizationThree]);
  await MenuAccess.insertMany(data.map((data) => ({ ...data })));
};

module.exports = { menuAccess, insertMenuAccess };
