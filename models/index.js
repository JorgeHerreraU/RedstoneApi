const dbConfig = require("../config/db");
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    username: dbConfig.USER,
    password: dbConfig.PWD,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    database: dbConfig.DB,
    protocol: "postgres",
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./User")(sequelize, Sequelize);
db.customers = require("./Customer")(sequelize, Sequelize);
db.services = require("./Service")(sequelize, Sequelize);
db.servicesOffered = require("./ServiceOffered")(sequelize, Sequelize);
db.address = require("./Address")(sequelize, Sequelize);
db.stage = require("./Stage")(sequelize, Sequelize);
db.category = require('./ServiceCategory')(sequelize, Sequelize);
db.team = require('./Team')(sequelize, Sequelize);

db.customers.hasMany(db.services, {
    foreignKey: "customer_id",
    as: "services",
});
db.services.belongsTo(db.customers, {
    foreignKey: "customer_id",
    as: "customer",
});
db.servicesOffered.hasMany(db.services, {
    foreignKey: "serviceoffered_id"
});
db.services.belongsTo(db.servicesOffered, {
    foreignKey: "serviceoffered_id"
});
db.customers.hasOne(db.address, {
    foreignKey: "customer_id",
});
db.address.belongsTo(db.customers, {
    foreignKey: "customer_id",
});
db.services.hasMany(db.stage, {
    foreignKey: 'service_id',
    as: "stages"
});
db.stage.belongsTo(db.services, { foreignKey: "service_id" });
db.servicesOffered.belongsTo(db.category, {
    foreignKey: 'category_id'
})
db.category.hasMany(db.servicesOffered, {
    foreignKey: 'category_id'
})
db.stage.belongsTo(db.team, {
    foreignKey: 'team_id'
})
db.team.hasMany(db.stage, {
    foreignKey: 'team_id'
})

module.exports = db;
