const { uploadService } = require("../services");
const fs = require('fs');
const { Datos } = require("../models");
const readline = require("readline")
const stream = require("stream");
const Excel = require('exceljs');
var DBF = require('stream-dbf');
exports.upload = async (req,res,next) => {
    try {
        let jsonData = []
        const jsonNames = [
            "Mapa",
            "CVE_ENT",
            "NOM_ENT",
            "NOM_ABR",
            "CVE_MUN",
            "NOM_MUN",
            "CVE_LOC",
            "NOM_LOC",
            "Ambito",
            "Latitud",
            "Longitud",
            "Lat_Decimal",
            "Lon_Decimal",
            "Altitud",
            "CVE_Carta",
            "Pob_Total",
            "Pob_Masculina",
            "Pob_Femenina",
            "Total_Viviendas",
        ]
        const parseToInt = [
            "Mapa",
              "CVE_ENT",
          "CVE_MUN",
          "CVE_LOC",
          "Altitud",
          "Pob_Total"
        ]
        const parseToFloat = [
            "Lat_Decimal",
          "Lon_Decimal",
        ]
        console.log(req.files)
        const FILE_NAME = req.files?.archivo.name
        let lineasTotales = 0 //despues de cada parse
        let datosSubidos = 0 //despues de cada query
        let porcentaje = 0.0 // (subidos*100) / totales
        const subirArchivo = async (file) =>{
            let response = await uploadService.uploadFile(file);
            if (!response.ok) {
                throw response.message;
            }
            return response.data
        }

        let resp = await subirArchivo(req.files?.archivo);

        //leer el archivo y subirlo en csv
        const FILE_TYPE = resp.split(".")[1]
        const readStream = fs.createReadStream(resp, 'utf-8');
        if(FILE_TYPE==="dbf"){
            let parser = new DBF(resp);
            let stream = parser.stream;
            stream.on('data', function(record){
                // console.log(record.MAPA)
                let ind = 0
                let item = {}
                for(let key in record){
                    if(key!=="@sequenceNumber"){
                        if(key!=="@deleted"){
                            if(key!=="ESTATUS"){
                                item[jsonNames[ind]] = record[key]
                                ind++
                            }
                        }
                    }
                    
                }
                for(let key in item){ 
                    if(parseToInt.includes(key)){
                        item[key] = parseInt(item[key]) 
                    }
                    else if(parseToFloat.includes(key)){
                        item[key] = parseFloat(item[key])
                    }
                }
                lineasTotales++
                jsonData.push(item)
            });
            stream.on('end',async function(){
                    let dataQuery = []
                    jsonData.forEach((e)=>{
                        dataQuery.push(Datos.create(e))
                        datosSubidos++
                    })
                    
                    await Promise.all(dataQuery)
                    porcentaje = (datosSubidos*100) / lineasTotales
                    
                    return res.status(200).json({
                        porcentaje,
                        datosSubidos,
                        lineasTotales,
                        FILE_NAME
                    });
            });

        }else if(FILE_TYPE==="xlsx"){
            var workbook = new Excel.Workbook(); 
            workbook.xlsx.readFile(resp)
                .then(function() {
                    var worksheet = workbook.getWorksheet(1);
                    worksheet.eachRow({ includeEmpty: true }, async function(row, rowNumber) {
                    if(rowNumber!==1){
                        lineasTotales++
                        let cleanedData = []
                        row.values.forEach(e=>{
                            if(e!==undefined){
                                cleanedData.push(e)
                            }
                        })

                        let item = {}
                        cleanedData.forEach((e,i)=>{
                            item[jsonNames[i]] = e
                                
                        })
                        jsonData.push(item)
                    }
                    });
                })
                .then(async ()=>{
                    let dataQuery = []
                    jsonData.forEach((e)=>{
                        dataQuery.push(Datos.create(e))
                        datosSubidos++
                    })
                    
                    await Promise.all(dataQuery)
                    porcentaje = (datosSubidos*100) / lineasTotales
                    
                    return res.status(200).json({
                        porcentaje,
                        datosSubidos,
                        lineasTotales,
                        FILE_NAME
                    });
                    
                });
                
        }else{
            
            let rl = readline.createInterface({input: readStream})
    
            rl.on('line', (line) => {
                if(FILE_TYPE==="txt"){
                    let splitedData = line.split(`\t`)
                    let cleanedData = []
                    splitedData.forEach(e=>{
                        if(e!==`""`){
                            cleanedData.push(e)
                        }
                    })
                    let item = {}
                    cleanedData.forEach((e,i)=>{
                        item[jsonNames[i]] = e
                    })
                    for(let key in item){ 
                        item[key] = item[key].replaceAll(`"`,"")
                        if(parseToInt.includes(key)){
                            item[key] = parseInt(item[key]) 
                        }
                        else if(parseToFloat.includes(key)){
                            item[key] = parseFloat(item[key])
                        }
                    }
                    lineasTotales++
                    jsonData.push(item)
                }
                if(FILE_TYPE==="csv"){
                    let splitedData = line.split(",")
                    let cleanedData = []
                    splitedData.forEach(e=>{
                        if(e!==``){
                            cleanedData.push(e)
                        }
                    })
                    let item = {}
                    cleanedData.forEach((e,i)=>{
                        item[jsonNames[i]] = e
                    })
                    for(let key in item){ 
                        item[key] = item[key].replaceAll(`"`,"")
                        if(parseToInt.includes(key)){
                            item[key] = parseInt(item[key])
                        }
                        else if(parseToFloat.includes(key)){
                            item[key] = parseFloat(item[key])
                        }
                    }
                    lineasTotales++
                    jsonData.push(item)
                }else if(FILE_TYPE==="kml"){
                    let cleanedData = removeAngleBracketElements(line)
                    cleanedData.shift()
                    cleanedData.splice(-1)
                    let item = {}
                    cleanedData.forEach((e,i)=>{
                        item[jsonNames[i]] = e
                    })
                    for(let key in item){ 
                        if(parseToInt.includes(key)){
                            item[key] = parseInt(item[key]) 
                        }
                        else if(parseToFloat.includes(key)){
                            item[key] = parseFloat(item[key])
                        }
                    }
                    lineasTotales++
                    jsonData.push(item)
                }
            });
            rl.on('error', (error) => console.log(error.message));
            rl.on('close', async () => {
                console.log('Data parsing completed');
                if(FILE_TYPE!=="kml"){
                    jsonData.shift()
                }else{
                    jsonData.shift()
                    jsonData.splice(-1)
                }
                if(FILE_TYPE==="txt"){
                    lineasTotales = lineasTotales - 1
                }
                if(FILE_TYPE==="kml"){
                    lineasTotales = lineasTotales - 2
                }
                if(FILE_TYPE==="csv"){
                    lineasTotales = lineasTotales - 1
                }
                let dataQuery = []
                jsonData.forEach((e)=>{
                    dataQuery.push(Datos.create(e))
                    datosSubidos++
                })
                    
                await Promise.all(dataQuery)
                porcentaje = (datosSubidos*100) / lineasTotales
                    
                return res.status(200).json({
                    porcentaje,
                    datosSubidos,
                    lineasTotales,
                    FILE_NAME
                });
                
                
            })
        }

    } catch(e){
        console.log(e)
        return res.status(401).json({
            message: "algo salio mal"
        })
    } 
}


function removeAngleBracketElements(str) {
    let result = [];
    let currentWord = "";
    let insideBrackets = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "<") {
        insideBrackets = true;
        if (currentWord) {
          result.push(currentWord);
          currentWord = "";
        }
      } else if (str[i] === ">") {
        insideBrackets = false;
      } else if (!insideBrackets) {
        currentWord += str[i];
      }
    }
    if (currentWord) {
      result.push(currentWord);
    }
    return result;
}