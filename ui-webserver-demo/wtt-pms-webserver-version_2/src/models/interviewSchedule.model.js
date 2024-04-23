const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const interviewScheduleSchema = mongoose.Schema({
  scheduleByUserid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  candidateEmail: {
    type: Object,
    trim: true,
  },
  candidateFirstname: {
    type: String,
    trim: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'JobOpening'
  },
  provider: {
    type: String,
    trim: true,
  },
  meetingLink: {
    type: String,
    trim: true,
  },
  eventId: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
  },
  time: {
    type: Object,
    trim: true,
  },
  Attendee: {
    type: Array,
    trim: true,
  },
  resumeId: {
    type: String,
    trim: true,
  },
  primarySkills: {
    type: Array,
    trim: true,
  },
  secondarySkills: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
    default: 'N'
  },
  location: {
    type: String,
    trim: true,
  },
  isGenerateQA: {
    type: Boolean,
    default:false
  },
},
{
  toJSON: { getters: true },
  timestamps: true,
});

interviewScheduleSchema.plugin(toJSON);
interviewScheduleSchema.plugin(paginate);

const interviewSchedule = mongoose.model('interviewSchedule', interviewScheduleSchema);
module.exports = interviewSchedule;
