const { uploadService } = require("../services");
const fs = require('fs');
const { Datos } = require("../models");
const readline = require("readline")
exports.upload = async (req,res,next) => {
    try {
        const subirArchivo = async (file) =>{
            let response = await uploadService.uploadFile(file);
            if (!response.ok) {
                throw response.message;
            }
            return response.data
        }

        let resp = await subirArchivo(req.files?.archivo);

        //leer el archivo y subirlo en csv
        const readStream = fs.createReadStream(resp, 'utf-8');
        let rl = readline.createInterface({input: readStream})
        let jsonData = []
        rl.on('line', (line) => {
            let data = line
            let splitedUsefullData = data.split(',')
            // console.log(splitedUsefullData)
            jsonData.push(parseJson(splitedUsefullData))
        });
        rl.on('error', (error) => console.log(error.message));
        rl.on('close', async () => {
            console.log('Data parsing completed');

            jsonData.forEach(e=>{
                e.Mapa = parseInt(e.Mapa.replaceAll(`"`,""))
                e.CVE_ENT =  parseInt(e.CVE_ENT.replaceAll(`"`,""))
                e.NOM_ENT = e.NOM_ENT.replaceAll(`"`,"")
                e.NOM_ABR = e.NOM_ABR.replaceAll(`"`,"")
                e.CVE_MUN = parseInt(e.CVE_MUN.replaceAll(`"`,""))
                e.NOM_MUN = e.NOM_MUN.replaceAll(`"`,"")
                e.CVE_LOC = parseInt(e.CVE_LOC.replaceAll(`"`,""))
                e.NOM_LOC = e.NOM_LOC.replaceAll(`"`,"")
                e.Ambito = e.Ambito.replaceAll(`"`,"")
                e.Latitud = e.Latitud.replaceAll(`"`,"")
                e.Longitud = e.Longitud.replaceAll(`"`,"")
                e.Lat_Decimal = parseFloat(e.Lat_Decimal.replaceAll(`"`,"")) 
                e.Lon_Decimal = parseFloat(e.Lon_Decimal.replaceAll(`"`,"")) 
                e.Altitud = parseInt(e.Altitud.replaceAll(`"`,"")) 
                e.CVE_Carta = e.CVE_Carta.replaceAll(`"`,"")
                e.Pob_Total = parseInt(e.Pob_Total.replaceAll(`"`,"")) 
                e.Pob_Masculina = e.Pob_Masculina.replaceAll(`"`,"")
                e.Pob_Femenina = e.Pob_Femenina.replaceAll(`"`,"")
                e.Total_Viviendas = e.Total_Viviendas.replaceAll(`"`,"")
            })

            jsonData.shift()

            try {
                let dataQuery = []
                jsonData.forEach((e)=>{
                    dataQuery.push(Datos.create(e))
                })
        
                await Promise.all(dataQuery)
                console.log("querys finalizadas correctamente")
                return res.status(200).json({
                    ok: true,
                    message: "archivo cargado"
                });
            }catch(e){
                console.log(e)
                return res.status(500).json({
                    message: "error"
                });
            }
            
        })
        // Read and display the file data on console
        // let fileData = ""
        // reader.on('data', function (chunk) {
        //     fileData = chunk.toString()
                
        // });

        // reader.on('end', () => {
        //     console.log(fileData)
        // });

        // let splitedData = fileData.split('HABITADAS')
        // let usefullData = splitedData[1]
        // let splitedUsefullData = usefullData.split(',')
        // //aun no se pierde el ultimo splitedUsefullData
        // times = Math.round(splitedUsefullData.length/19)
        // let ordererData = []
        // for(let i=0;i<times;i++){
        //     ordererData.push(splitedUsefullData.splice(0,19))
        // }
        // for(let i=1;i<ordererData.length;i++){
        //     ordererData[i][0] = ordererData[i][0].replace(/[\r\n]/gm, ',').split(',')
        // }
        // for(let i=1;i<ordererData.length;i++){
        //     ordererData[i-1].push(ordererData[i][0][0])
        //     ordererData[i][0] = ordererData[i][0].slice(-1)
        // }
        // let parsedData = []
        // ordererData.forEach(e=>{
        //     parsedData.push(parseJson(e))
        // })
        // parsedData[parsedData.length-1].Total_Viviendas = splitedUsefullData[0].replace(/[\r\n]/gm, ',').split(',')[0]
        // console.log(parsedData)
        
        
        
        

    } catch(e){
        console.log(e)
        return res.status(401).json({
            message: "algo salio mal"
        })
    } 
}

function parseJson(array){
    parsed = {
        Mapa:array[0],
        CVE_ENT:array[2],
        NOM_ENT:array[3],
        NOM_ABR:array[4],
        CVE_MUN:array[5],
        NOM_MUN:array[6],
        CVE_LOC:array[7],
        NOM_LOC:array[8],
        Ambito:array[9],
        Latitud:array[10],
        Longitud:array[11],
        Lat_Decimal:array[12],
        Lon_Decimal:array[13],
        Altitud:array[14],
        CVE_Carta:array[15],
        Pob_Total:array[16],
        Pob_Masculina:array[17],
        Pob_Femenina:array[18],
        Total_Viviendas:array[19],
    }
    return parsed
}

