const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");


exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
    let email = req.body.email;
    try {
        let user = await User.findOne({email: email})
        if (user) {
            if(user.email === email)
            return res.status(400).send({
                success: false,
                message: "email  already exists"
            })
        }
        return next()
    } catch (error) {
        console.log(`error: ${error.message}`)
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }


}

exports.verifyAdmin = async(req, res, next)=> {
    let email = req.body.email;

    try {
        let user = await User.findOne({userType: "ADMIN"});

    if(user)
    {if(user.userType === "ADMIN" && req.body.userType === "ADMIN"){
        return res.status(500).send({
            success: false,
            message: "Only one ADMIN can exist"
        })
    }}
    return next()
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
    
}

exports.verifyToken = async (req, res, next) => {
    try {
     
        if(req.header('Authorization').length <= 0){
            return res.status(400).send({
                success: false,
                message: 'invalid token'
            })
        }
        const token = req.header('Authorization').replace('Bearer ', '')
        
        jwt.verify(token, config.secret , async (err, decodedToken) => {
            if (err) {
                console.log('err => ', err)
                 return res.status(401).send({ success: false, message: 'Token Expired' })
            } else {
            req.userId = decodedToken._id
            req.token = token
            next()
                }
        })

        
    } catch (error) {
         return res.status(401).send({ success: false, error: 'Please authenticate.' })
    }
}
