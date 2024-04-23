const allStatus = {
  applied: ['candidate', 'recruiter', 'admin'],
  withDraw: ['candidate'],
  processed: ['recruiter'],
  selected: ['recruiter'],
  closed: ['recruiter'],
  scheduled: ['recruiter', 'admin'],
  shortlisted: ['recruiter'],
  'l1 select': ['recruiter'],
  'l2 select': ['recruiter'],
  'final select': ['recruiter'],
  offered: ['recruiter'],
  joined: ['recruiter'],
  rejected: ['recruiter'],
};
/**
 * @status
 * Applied - candidate,
 * WithDraw -  candidate,
 * Processed - recruiter,
 * Scheduled - recruiter,
 * Selected - recruiter,
 * Closed - recruiter
 */
const status = Object.keys(allStatus);
const statusRights = { get: (role) => Object.keys(allStatus).filter((st) => allStatus[st].includes(role)) };

module.exports = {
  status,
  statusRights,
  allStatus,
};
