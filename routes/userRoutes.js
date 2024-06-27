const express = require('express')
const router = express.Router()

const { signupUser,
        loginUser,
        userLogout,
        postQuestion,
        getThreads,
        viewQuestion,
        searchThreads
    } = require('../controllers/userControllers')
const {verificationMailer,verifyUser} = require('../middleware/mail')
const {userAuthCheck} = require('../middleware/userAuth')

router.route('/signup')
.post(signupUser,verificationMailer)

router.route('/verify')
.get(verifyUser)

router.route('/login')
.post(loginUser)

router.route('/protected')
.get(userAuthCheck, (req,res) => res.send('inside protected route'))

router.route('/logout')
.get(userAuthCheck,userLogout)

router.route('/addQuestion')
.post(userAuthCheck,postQuestion)

router.route('/getThreads')
.post(userAuthCheck,getThreads)

router.route('/viewQuestion')
.put(userAuthCheck,viewQuestion)

router.route('/searchThreads')
.get(userAuthCheck,searchThreads)

module.exports = router