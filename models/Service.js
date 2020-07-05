module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "service",
        {
            customer_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "customer",
                    key: "id",
                },
            },
            serviceoffered_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "services_offered",
                    key: "id",
                },
            },
            cart_id: {
                type: Sequelize.UUID,
            }
        },
        {
            tableName: "service",
            timestamps: false,
            onDelete: 'CASCADE'
        }
    );
};
