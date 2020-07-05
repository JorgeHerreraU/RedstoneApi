module.exports = (sequelize, Sequelize) => {
    return sequelize.define("serviceoffered", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        basePrice: {
            type: Sequelize.INTEGER,
            field: 'base_price'
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'service_category',
                key: 'id'
            }
        }
    }, {
        tableName: 'service_offered',
        timestamps: false
    });
}
