module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "servicecategory",
        {
            description: {
                type: Sequelize.STRING,
            }
        },
        {
            tableName: "service_category",
            timestamps: false,
        }
    );
};
