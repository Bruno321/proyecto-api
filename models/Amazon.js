const Sequelize = require('sequelize')
const { db } = require('../config/')

const Amazon = db.define('amazon',{
    date:Sequelize.STRING,
    price:Sequelize.DOUBLE
})


module.exports = Amazon;