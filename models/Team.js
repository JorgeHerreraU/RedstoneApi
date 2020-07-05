module.exports = (sequelize, Sequelize) => {
    return sequelize.define("team", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        fee: {
            type: Sequelize.INTEGER
        }
    },
        {
            tableName: "team",
            timestamps: false,
        });
}
