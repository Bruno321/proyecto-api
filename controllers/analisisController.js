const {Bitcoin} = require("../models")
const {Amazon} = require("../models")

exports.analyze = async (req,res,next) => {
    try {
        const {value} = req.body
        //base de datos a consultar,k,j,alfa
        //pronostico a 1 
        const information = {
            price:[20977.48,19910.54,18868.91,18117.59,17446.36,17192.95,17093.99,16954.15,16952.12,16836.47]
        }
        // if(value==="bitcoin"){
        //     information = await Bitcoin.findAll()
        // }else if(value==="amazon"){
        //     information = await Amazon.findAll()
        // }

        const psData = promedioSimple(information.price)
        const pmsData = promedioMovilSimple(information.price,2)
        const pmdData = promedioMovilDoble(information.price,pmsData.pmd,2,3)
        const pmdaData = promedioMovilDobleAjustado(information.price,pmdData.pmd,pmsData.pmd,2,3)
        const ptmacData = promedioTmac(information.price);
        return res.status(200).json({
            psData,
            pmsData,
            pmdData,
            pmdaData,
            ptmacData
        })
    } catch(e){
        console.log(e)
        return res.status(500)
    }
}

function promedio(values){
    let suma = 0
    values.forEach((e,i)=>{
        suma = suma + e
    })
    let prom = suma/values.length
    return prom
}

function errorAbsoluto(value,predictedValue){
    let eAbs = Math.abs(value-predictedValue)
    return eAbs
}

function errorMedio(values,predictedValues){
    let errorAbsolutoList = []
    predictedValues.forEach((e,i)=>{
        errorAbsolutoList.push(errorAbsoluto(values[i],e))
    })

    let result = promedio(errorAbsolutoList)
    return result
}

function errorRelativo(errorMedio,ultimoValor){
    let eR = (errorMedio*100)
    eR = eR / ultimoValor
    return eR
}

function errorCuadratico(predictedValues){
    let potencias = []
    predictedValues.forEach(e=>{
        potencias.push(Math.pow(e,2))
    })
    let prom = promedio(potencias)
    let result = Math.sqrt(prom)
    return result
}

function promedioSimple(data){
    let price = data
    let ps = []
    ps.push(price[0])

    for(let i=1;i<price.length;i++){
        let values = price.slice(0,i)
        ps.push(promedio(values))
    }
    ps.push(promedio(price))

    let informacion = {
        ps,
        errorMedio:errorMedio(ps,price),
        errorRelativo:errorRelativo(errorMedio(ps,price),ps.slice(-1)),
        errorCuadratico:errorCuadratico(ps),
    }
    return informacion
}

function promedioMovilSimple(data,k){
    let price = data
    let pmd = []
    let contador = k
    for(let i=0;i<price.length-(k-1);i++){
        let subArray = price.slice(i,contador)
        pmd.push(promedio(subArray))
        contador++
    }
    let informacion = {
        pmd,
        //                                                 quita la ultima
        errorMedio:errorMedio(price.slice(k,price.length),pmd.slice(0,pmd.length-1)),
        errorRelativo:errorRelativo(errorMedio(price.slice(k,price.length),pmd.slice(0,pmd.length-1)),pmd.slice(-1)),
        errorCuadratico:errorCuadratico(pmd),
    }
    return informacion

}

function promedioMovilDoble(data,pmsData,k,j){
    let price = data
    let pmd = promedioMovilSimple(pmsData,j)
    pmd = pmd.pmd
    pmd.splice(-1)
    let informacion = {
        pmd,
        errorMedio:errorMedio(price.slice(k+j,price.length),pmd.slice(0,pmd.length-1)),
        errorRelativo:errorRelativo(errorMedio(price.slice(k,price.length),pmd.slice(0,pmd.length-1)),pmd.slice(-1)),
        errorCuadratico:errorCuadratico(pmd),
    }
    return informacion
}

function promedioMovilDobleAjustado(data,pmdData,pmsData,k,j){
    let price = data
    let a = []
    let b = []
    let pmda = []
    let contador = 0
    for(let i=j;i<pmsData.length;i++){
        a.push((2*pmsData[i])-pmdData[contador])
        b.push((Math.abs(pmdData[contador]-pmsData[i])*2)/pmdData.length)
        contador++
    }

    a.forEach((e,i)=>{
        pmda.push(e+(b[i]*1))
    })

    let informacion = {
        pmda,
        errorMedio:errorMedio(price.slice(k+j,price.length),pmda.slice(0,pmda.length-1)),
        errorRelativo:errorRelativo(errorMedio(price.slice(k+j,price.length),pmda.slice(0,pmda.length-1)),pmda.slice(-1)),
        errorCuadratico:errorCuadratico(pmda),
    }
    return informacion
}

function promedioTmac(data) {
    let price = data
    let tmac=[]
    let ptmac=[]
    for(let i=0;i<price.length-1;i++){
        let vI = price[i]
        let vF = price[i+1]
        ptmac.push(((vF/vI)-1)*100)
    }
    ptmac.forEach((e,i)=>{
        tmac.push(((e/10)*price[i+1])+price[i+1])
    })
    console.log(ptmac)
    console.log(tmac)
    let informacion = {
        tmac,
        errorMedio:errorMedio(price.slice(1,price.length),tmac),
        errorRelativo:errorRelativo(errorMedio(price.slice(1,price.length),tmac),tmac.slice(-1)),
        errorCuadratico:errorCuadratico(tmac),
    }
    return informacion
}