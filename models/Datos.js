const Sequelize = require('sequelize')
const { db } = require('../config/')

const Datos = db.define('datos',{
    Mapa:Sequelize.INTEGER(9),
    CVE_ENT:Sequelize.INTEGER(2),
    NOM_ENT:Sequelize.STRING(31),
    NOM_ABR:Sequelize.STRING(6),
    CVE_MUN:Sequelize.INTEGER(3),
    NOM_MUN:Sequelize.STRING(76),
    CVE_LOC:Sequelize.INTEGER(4),
    NOM_LOC:Sequelize.STRING(95),
    Ambito:Sequelize.STRING(1),
    Latitud:Sequelize.STRING(14),
    Longitud:Sequelize.STRING(15),
    Lat_Decimal:Sequelize.DOUBLE(9,6),
    Lon_Decimal:Sequelize.DOUBLE(11,6),
    Altitud:Sequelize.INTEGER(4),
    CVE_Carta:Sequelize.STRING(6),
    Pob_Total:Sequelize.INTEGER(7),
    Pob_Masculina:Sequelize.STRING(6),
    Pob_Femenina:Sequelize.STRING(6),
    Total_Viviendas:Sequelize.STRING(6),
})


module.exports = Datos;