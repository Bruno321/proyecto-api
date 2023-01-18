const Sequelize = require('sequelize')
const { db } = require('../config/')

const Bitcoin = db.define('bitcoin',{
    date:Sequelize.DATEONLY,
    price:Sequelize.INTEGER
})


module.exports = Bitcoin;