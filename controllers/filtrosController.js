const {Datos} = require("../models")

exports.filtrar = async (req,res,next) => {
    try {
        const {filtros} = req.body
        const elementos = [
            "Mapa",//nocpuede
            "CVE_ENT",//nocpuede
            "NOM_ENT",
            "NOM_ABR",
            "CVE_MUN",
            "NOM_MUN",//nocpuede
            "CVE_LOC",//nocpuede
            "NOM_LOC",
            "Ambito",//nocpuede
            "Latitud",
            "Longitud",
            "Lat_Decimal",//noc puede
            "Lon_Decimal",//noc puede
            "Altitud",//nocpuede
            "CVE_Carta",
            "Pob_Total",//nocpuede
            "Pob_Masculina",
            "Pob_Femenina",
            "Total_Viviendas",
        ]
        let elementsToCheck = ["id"]
        
        filtros.forEach((e,i) => {
            elementsToCheck.push(elementos[e])
        });
        let datos = await Datos.findAll({
            attributes : elementsToCheck
        })
        let idToDelete = []
        let specialChars = []
        datos.forEach(e=>{
            let isAdded = false
            for(let key in e.dataValues){
                if(!isAdded){
                    if(hasSpecialCharacters(String(e.dataValues[key]))){
                        idToDelete.push(e.dataValues.id)
                        specialChars.push(e.dataValues[key])
                        isAdded = true
                    }
                }
            }
        })
        let dataQuery = []
        idToDelete.forEach((e)=>{
            dataQuery.push(Datos.destroy({where:{id:e}}))
        })
          
        await Promise.all(dataQuery)
        let date_ob = new Date();
        const operacionesRealizadas = `
        El ${date_ob.getDate()} del mes ${date_ob.getMonth()} del año ${date_ob.getFullYear()} a las ${date_ob.getHours()}:${date_ob.getMinutes}
        el administrador realizo un filtrado con los siguientes parametros:
        ${elementsToCheck}
        `
        
        return res.status(200).json({
            borrados: idToDelete.length,
            seleccionados: elementsToCheck,
            specialChars
        })
    } catch(e){
        console.log(e)
        return res.status(401).json({
            message: "Algo salio mal"
        })
    }
  
}

function hasSpecialCharacters(string) {
    // var specialChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?";
    var specialChars = "!@#$%^&*+=\\\';,/{}|\":<>?";
    for (var i = 0; i < string.length; i++) {
      if (specialChars.indexOf(string.charAt(i)) != -1) {
          return true;
      }
    }
    return false;
  }