const emailService = require('../services/email.service');
const EmailQueue = require('../models/emailEnque.model');
const scheduler = require('node-schedule');
const logger = require('../config/logger');

const emailSchedulor = (callBack) => {
  scheduler.scheduleJob('*/2 * * * *', async () => {
    var enqueueData = await EmailQueue.find({ processed: false });
    if (enqueueData.length > 0) {
      enqueueData.map(async (key) => {
        callBack(key.toAddress, key.bccAddress, key.ccAddress, key.subject, key.body);
        await EmailQueue.updateMany({ toAddress: key.toAddress }, { $set: { processed: true } }, { multi: true });
      });
    }
    logger.info(
      'Email not sented to ' +
        (await EmailQueue.count({ processed: false })) +
        ' EmailIds \n' +
        (await EmailQueue.find({ processed: false })).map((data) => data.toAddress).join('\n') +
        ' & Email is sented to ' +
        (await EmailQueue.count({ processed: true })) +
        ' EmailIds.'
    );
  });
};

module.exports = emailSchedulor;
