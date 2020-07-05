module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "stage",
        {
            name: {
                type: Sequelize.STRING,
            },
            schedule: {
                type: Sequelize.DATE,
            },
            isPaid: {
                type: Sequelize.STRING,
                field: 'is_paid'
            },
            ammount: {
                type: Sequelize.INTEGER,
            },
            service_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "service",
                    key: "id",
                },
            },
            team_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "team",
                    key: "id",
                },
            },
        },
        {
            tableName: "stage",
            timestamps: false,
        }
    );
};
