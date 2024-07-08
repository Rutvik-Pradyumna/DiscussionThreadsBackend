const nodemailer = require('nodemailer')
const User = require('../models/userModel')

exports.verificationMailer = (req,res,next) => {
    let { email,_id } = req.user
    let transporter = nodemailer.createTransport({
        service : 'Gmail',
        auth : {
            user : process.env.MAIL_ID,
            pass : process.env.MAIL_PSWD
        }
    })
    let mailOptions = {
        from : process.env.MAIL_ID,
        to : email,
        subject : 'Verify Your Mail for DiscussionThreads',
        html : `<a href="http://localhost:5000/api/verify?userId=${_id}">Click here to verify</a>`
    }
    transporter.sendMail(mailOptions)
    .then( info => console.log(info.response))
    .catch( err => next(err) )

    res.send('Check Your Email for Verification Process.')
}

exports.verifyUser = async (req,res,next) => {
    let { userId } = req.query
    let user = await User.findById(userId)
    if(!user) return res.send('Invalid userId')
    else{
        await User.findByIdAndUpdate(userId,{isVerified : true})
        res.send('Verification Successfull. Now go to login page to login')
    }
}