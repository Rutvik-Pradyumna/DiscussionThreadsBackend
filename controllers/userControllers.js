const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const Question = require('../models/questionModel')
const Answer = require('../models/answerModel')
const Reaction = require('../models/reactionsModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const axios = require('axios')

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
                res.cookie('jwtToken',jwtToken,{expires:new Date(Date.now() + 24*60*60*1000)})
                res.cookie('name',user.name,{expires:new Date(Date.now() + 24*60*60*1000)})
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

exports.postQuestion = async (req,res) => {
    try{
        const response = await axios.post('http://127.0.0.1:7000/classify',{text : req.body.question})
        if(response.data[0].label==='hate') return res.status(400).send("Hate Speech")
    } catch (err) {
        return res.status(400).send(err)
    }

    let newQuestion = new Question({
        "byWhom" : req.body.byWhom,
        "question" : req.body.question,
        "filters" : req.body.filters,
        "branchFilter" : req.body.branchFilter,
        "visits" : req.body.visits,
        "time" : req.body.time
    })

    try{
        await newQuestion.save()
        res.send("Question Stored Succesfully")
    }
    catch (err) {
        res.status(400).send("Error storing data")
    }
}

exports.getThreads = async (req,res) => {
    let data
    if(req.body.arrange.length===0)
        data = await Question.find()
    else{
        let field,order
        let arrange = req.body.arrange[0]
        if(arrange==="Latest"){
            field = "time"
            order = "desc"
        } else if (arrange==="Oldest"){
            field = "time"
            order = "asc"
        } else if (arrange==="MostAnswered"){
            field = "answers"
            order = "desc"
        } else if (arrange==="LeastAnswered"){
            field = "answers"
            order = "asc"
        } else if (arrange==="MostVisits"){
            field = "visits"
            order = "desc"
        } else if (arrange==="LeastVisits"){
            field = "visits"
            order = "asc"
        }
        const sortOrder = order === 'asc' ? 1 : -1
        data = await Question.find().sort({ [field]: sortOrder })
    }
    
    if(req.body.branchFilter.length===0 & req.body.filter.length===0)
        return res.send(data)

    let threads = []
    for(eachQues of data){
        if(req.body.branchFilter.includes(eachQues.branchFilter)){
            threads.push(eachQues)
            continue
        }
        for(field of eachQues.filters){
            if(req.body.filter.includes(field)){
                threads.push(eachQues)
                break
            }
        }
    }
    res.send(threads)
}

exports.viewQuestion = async (req,res) => {
    let question = await Question.findOne(
        { _id : req.query._id }
    ).populate('answers')
    if(!question) return res.status(400).send('Invalid Id')
    let {answers} = question
    let sortedAnswers = answers.sort((a, b) => {
        return b.upvotes === a.upvotes ? a.downvotes-b.downvotes : b.upvotes-a.upvotes
    })
    question.answers = sortedAnswers

    let questionObject = question.toObject()
    let reactions = await Reaction.find({username : req.user.name})
    questionObject.reactions = reactions

    res.send(questionObject)
}

exports.addView = async (req,res) => {
    let question = await Question.findOneAndUpdate(
        { _id : req.query._id },
        { $inc: { visits : 1 } },
        { new: true }   
    )
    res.send("success")
}

exports.searchThreads = async (req,res) => {
    const searchVal = req.query.searchVal.toLowerCase()
    const data = await Question.find()
    let finalData = []
    for(eachQuestion of data){
        if(eachQuestion.question.toLowerCase().includes(searchVal))
            finalData.push(eachQuestion)
    }
    res.send(finalData)
}

exports.getProfile = async (req,res) => {
    const {username} = req.query
    const user = await User.find({name:username})
    const questions = await Question.find({byWhom:username})
    const userInfo={
        userInfo : user,
        userQuestions : questions
    }
    res.send(userInfo)
}

exports.addAns = async (req,res) => {
    try{
        const response = await axios.post('http://127.0.0.1:7000/classify',{text : req.body.answer})
        if(response.data[0].label==='hate') return res.status(400).send("Hate Speech")
    } catch (err) {
        return res.status(400).send(err)
    }

    let answer = await Answer.create({
        byWhom : req.body.byWhom,
        description : req.body.answer,
        upvotes : 0,
        downvotes : 0,
        time : req.body.time
    })

    await Question.updateOne(
        { _id : req.body.toquestion},
        { $push : { answers : new mongoose.Types.ObjectId(answer._id) } },
        { upsert : false, new : true }
    )

    res.send("Answer added successfully")
}

exports.addReaction = async (req,res) => {
    const {name} = req.user 
    const {_id} = req.query
    const {upvote, downvote} = req.body
    let upVoteChange=0
    let downVoteChange=0

    let reaction = await Reaction.findOne({username : name, answerId : _id})
    if(reaction){
        upVoteChange = upvote-reaction.upvote
        downVoteChange = downvote-reaction.downvote
        await Reaction.findOneAndUpdate(
            {username : name, answerId : _id},
            {$set : {upvote:upvote, downvote:downvote}},
            { new: true, runValidators: true }
        )
    }
    else{
        reaction = await Reaction.create({
            username : name,
            answerId : _id,
            upvote : upvote,
            downvote : downvote
        })
        upVoteChange = upvote-0
        downVoteChange = downvote-0
    }
    
    const updatedAnswer = await Answer.findOneAndUpdate(
        { _id : _id},
        { $inc : {upvotes : upVoteChange, downvotes : downVoteChange}},
        { new: true, runValidators: true }
    )

    res.send(updatedAnswer)
}

exports.deleteThread = async (req,res) => {
    await Question.findOneAndDelete({_id : req.query._id})
    res.send("success")
}