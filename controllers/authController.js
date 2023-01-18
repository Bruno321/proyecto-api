const jwt = require("jsonwebtoken");

const tokenKey = 'debugKey'

exports.login = (req,res,next) => {
    const {email,password} = req.body
    if(email==="email@email.com" && password==="password"){
        const token = jwt.sign(
            {
              "user":"user",
            },
            tokenKey
          );
    
        return res.status(200).json({
            token
        })
    }else{
        return res.status(401).json({
            message: "Usuario o contraseña incorrectos"
        })
    }
}