const defaultUser = (config) => {
  return {
    role: 'admin',
    isActive: false,
    isEmailVerified: true,
    firstName: config.user,
    lastName: config.user,
    designation: 'backEndSystem',
    mobileNumber: '9867463526',
    emailAddress: config.user,
    password: `${config.pass}1`,
    organizationName: 'WTT',
  };
};

module.exports = defaultUser;
