const bcrypt = require('bcrypt')
const User = require('../models/userModel')
// const jwt = require('jsonwebtoken')
// const uuid = require('uuid')
// const { sendVerMail } = require('../middleware/emailVerify')
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