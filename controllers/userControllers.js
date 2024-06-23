const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// const uuid = require('uuid')
// const { mongoose } = require('mongoose')

exports.signupUser = async (req,res,next) => {
    try{
        let hashedPassword = await bcrypt.hash(req.body.password,parseInt(process.env.SALT))
        
        let newUser = new User({
            "email" : req.body.email,
            "name" : req.body.name,
            "branch" : req.body.branch,
            "year" : req.body.year,
            "age" : req.body.age,
            "password" : hashedPassword,
            "gender" : req.body.gender,
            "section" : req.body.section
        })

        let existingUser = await User.findOne({"username" : newUser.username})
        let exisitingEmail = await User.findOne({"email" : newUser.email})
        if(existingUser || exisitingEmail) return res.status(400).send('User Already Exists')
        else{
            newUser.save()
            req.user = newUser
            return next()
        }
    } catch(err) {
        next(err)
    }
}

exports.loginUser = async (req,res,next) => {
    let { email, password } = req.body
    let user = await User.findOne({"email" : email})
    if(!user){
        return res.status(400).send('User not found')
    }
    else{
        if(!user.isVerified){
            return res.status(400).send('Verify your Email to continue')
        }

        bcrypt.compare(password,user.password)
        .then( async (isPswdMatched) => {
            if (isPswdMatched) {
                // creating and storing and checking expiry date of token
                let jwtToken = jwt.sign({"email" : user.email},process.env.SECRET,{"expiresIn" : "1d"})
                // updating old tokens
                user.updateTokens(1,jwtToken)
                res.cookie('jwtToken',jwtToken,{httpOnly:true, expires:new Date(Date.now() + 24*60*60*1000)})
                res.cookie('name',user.name,{httpOnly:true, expires:new Date(Date.now() + 24*60*60*1000)})
                res.json({jwtToken})
            } else {
                res.status(400).send('Invalid password')
            }
        })
        .catch(err => next(err))
    }
}

exports.userLogout = async (req,res) => {
    let user = req.user
    await user.updateTokens(0,req.curJwt)
    res.clearCookie('jwtToken')
    res.clearCookie('name')
    res.clearCookie('email')
    res.send('User Logged Out')
}