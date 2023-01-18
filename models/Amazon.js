const Sequelize = require('sequelize')
const { db } = require('../config/')

const Amazon = db.define('amazon',{
    date:Sequelize.DATEONLY,
    price:Sequelize.INTEGER
})


module.exports = Amazon;