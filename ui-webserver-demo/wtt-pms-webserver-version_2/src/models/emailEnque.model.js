const mongoose = require('mongoose');

const emailEnqueSchema = mongoose.Schema({
toAddress:{
    type: Array,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
ccAddress:{
    type: Array,
    required: false,
    trim: true,
    lowercase: true,
  },
bccAddress: {
    type: Array,
    required: false,
    trim: true,
    lowercase: true,
  },
subject: {
    type: String,
    required: true,
    trim: true,
  },
body: {
    type: Object,
    required: true,
    trim: true,
  },
processed:{
    type: Boolean,
    default: false
  },
createaddatetime: {
    type: Date,
    required: true,
    trim: true,
  },
processeddatetime: {
    type: Date,
    required: true,
    trim: true,
  }
})

/**
 * @typedef emailqueue
 */
const EmailQueue = mongoose.model('emailqueue', emailEnqueSchema);

module.exports = EmailQueue;