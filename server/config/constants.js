const STATUS_PERCENT_MAP = {
  'Initial Communication': 10,
  'Discussion in Progress': 25,
  'Draft MoU to be Prepared': 40,
  'Draft Shared with Company': 55,
  'Draft Under Review': 65,
  'Revision / Clarification Required': 75,
  'Approval Awaited': 85,
  'Signing Date to be Finalized': 95,
  'Signed': 100,
  'On Hold': null, // Retains last percentage
  'Not Proceeding': 0
};

const STATUS_ORDER = [
  'Initial Communication',
  'Discussion in Progress',
  'Draft MoU to be Prepared',
  'Draft Shared with Company',
  'Draft Under Review',
  'Revision / Clarification Required',
  'Approval Awaited',
  'Signing Date to be Finalized',
  'Signed'
];

const ROLES = {
  ADMIN: 'Admin',
  CHAIRPERSON: 'Chairperson',
  COORDINATOR: 'Coordinator'
};

module.exports = {
  STATUS_PERCENT_MAP,
  STATUS_ORDER,
  ROLES
};
