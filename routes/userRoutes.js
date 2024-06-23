const express = require('express')
const router = express.Router()

const {signupUser} = require('../controllers/userControllers')
const {verificationMailer,verifyUser} = require('../middleware/mail')

router.route('/signup')
.post(signupUser,verificationMailer)

router.route('/verify')
.get(verifyUser)

module.exports = router