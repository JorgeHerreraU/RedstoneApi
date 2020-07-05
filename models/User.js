module.exports = (sequelize, Sequelize) => {
  return sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    profile: {
      type: Sequelize.STRING,
      defaultValue: 'Customer'
    },
    resetPasswordToken: {
      type: Sequelize.STRING
    },
    resetPasswordExpires: {
      type: Sequelize.DATE
    }
  });
}
