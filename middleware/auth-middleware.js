const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.auth = (req,res,next) =>{
    try{
        // Extract JWT token from request
        const token = req.body.token || req.cookies.token
        if (!token){
            return res.status(401).json({
                success: false,
                message: "Token not Found"
            })
        }
        // verify token
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.User = decode
            console.log(req.User)

        }catch (error){
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            
            })
        }

        next()

    } catch (error){
        return res.status(500).json({
            success: false,
            message: "Error Occured in Authentication"
        })
    }
}

exports.isStudent = (req,res,next)=>{
    try {
        console.log(req.User)
        if(req.User.role !=="Student"){
            return res.status(401).json({
                success: false,
                message: "You are Not an Authorized Student"
            })
        }
        next()
    } catch (error){
        return res.status(500).json({
            success: false,
            messsage : "An Error Occurred :" + error
        })
    }

}


exports.isAdmin = (req, res, next)=>{
    try{
        console.log(req.User)
        if(req.User.role !==Admin){
            return res.status(401).json({
                success: false,
                message: "You are not an Authorized Admin"
            })
        }
        next()
        
    }catch (error){
        return res.status(500).json({
            success: false,
            message : "Something went wrong:"  +error
        })
    }
}