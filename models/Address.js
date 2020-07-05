module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "address",
        {
            street: {
                type: Sequelize.STRING,
            },
            number: {
                type: Sequelize.INTEGER,
            },
            apartment: {
                type: Sequelize.STRING,
            },
            district: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            customer_id: {
                type: Sequelize.INTEGER,
                unique: true,
                references: {
                    model: "customer",
                    key: "id",
                },
            },
        },
        {
            tableName: "address",
            timestamps: false,
        }
    );
};
