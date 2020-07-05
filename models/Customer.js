module.exports = (sequelize, Sequelize) => {
    return sequelize.define("customer", {
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'customer',
        timestamps: false
    });
}
