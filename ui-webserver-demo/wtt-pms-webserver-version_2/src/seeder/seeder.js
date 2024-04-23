const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const envfile = require('envfile');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const logger = require('../config/logger');
const { SystemRole, MenuAccess, pricingplan, pricingPlanRules } = require('../models');
const systemRolesJSON = require('./data/systemRoles.json');
const menuAccessJSON = require('./data/menuAccess.json');
const pricingPlanJSON = require('./data/pricingPlans.json');
const pricingPlansRulesJSON = require('./data/pricingPlansRules.json');

const parsedFile = envfile.parseFileSync(path.join(__dirname, '/.seeder.env'));

const addSysRolesTOMonggooseDB = async () => {
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
  });
  const systemRoles = systemRolesJSON.map(
    (role) => new SystemRole({ ...role, modifiedByUserId: 'system', createdByUserId: 'system' })
  );

  systemRoles.map(async (p, index) => {
    await p.save((err) => {
      if (err) {
        logger.error(err);
      } else if (index === systemRoles.length - 1) {
        logger.info('Inserted defualt system roles');
        parsedFile.IS_SEEDER_DATA_ADDED = true;
        fs.writeFileSync(path.join(__dirname, '/.seeder.env'), envfile.stringifySync(parsedFile));
      }
    });
    const menu = menuAccessJSON.find((menu) => menu.role === p.name);
    if (menu) {
      menu.role = p.id || p._id;
      await MenuAccess.create(menu);
    }
  });
  const pricingPlans = pricingPlanJSON.map(async (plans) => {
      await pricingplan.create(plans);
  });

  const pricingPlansRules = pricingPlansRulesJSON.map(async(rules) => {
      await pricingPlanRules.create(rules);
  })
};

switch (parsedFile.IS_SEEDER_DATA_ADDED) {
  case 'true':
    logger.info('System Roles are already Inserted');
    break;
  case 'false':
    addSysRolesTOMonggooseDB();
    break;
  default:
    logger.info('Somthing went wrong');
}
