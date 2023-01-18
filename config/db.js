const Sequelize = require('sequelize');


const db = new Sequelize('bi', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    define: {
        timestamps: false
    },
    logging: false,
    dialectOptions: {
        options: {
          requestTimeout: 3000000000000
        }
      },

    pool: {
        max: 1,
        min: 0,
        acquire: 10000000,
        idle: 10000000
    },
})

module.exports = db