const express = require('express')
const router = express.Router()

const { signupUser,
        loginUser,
        userLogout,
        postQuestion,
        getThreads,
        viewQuestion,
        searchThreads,
        getProfile,
        addAns,
        addView,
        addReaction,
        deleteThread
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
.get(userAuthCheck,viewQuestion)

router.route('/addView')
.put(userAuthCheck,addView)

router.route('/searchThreads')
.get(userAuthCheck,searchThreads)

router.route('/getProfile')
.get(userAuthCheck,getProfile)

router.route('/addAns')
.post(userAuthCheck,addAns)

router.route('/reaction')
.put(userAuthCheck,addReaction)

router.route('/deleteThread')
.delete(userAuthCheck,deleteThread)

module.exports = router