const Sequelize = require('sequelize')
const { db } = require('../config/')

const Bitcoin = db.define('bitcoin',{
    date:Sequelize.STRING,
    price:Sequelize.DOUBLE
})


module.exports = Bitcoin;