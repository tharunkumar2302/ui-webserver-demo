const scheduler = require('node-schedule');
const logger = require('../config/logger');
const { User, Token } = require('../models');

const tokenSchedular = () => {
  let expireDate;
  let employerData;
  scheduler.scheduleJob('*/1 * * * *', async () => {
    employerData = await User.find({ status: 'Invited' });
    employerData.map(async (key) => {
      const userToken = await Token.find({ user: key._id });
      userToken.forEach((element) => {
        expireDate = element.expires;
      });
      const currDate = new Date();
      if (expireDate < currDate) {
        await User.updateMany({_id: key._id},{$set: {status: 'Expired'}})
      }
    });
  });
};

module.exports = tokenSchedular;
