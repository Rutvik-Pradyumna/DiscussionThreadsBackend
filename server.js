const express = require("express")
require('dotenv').config({path : './envFolder/.env'})
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser())
app.use('/api', require('./routes/userRoutes'))

// var conn_str = "mongodb://127.0.0.1:27017";
// var database;
// const jwt = require('jsonwebtoken')


// app.get('/addupvote', (req, res) => {
//     console.log(req.query)
    
//     req.query['aid'] = ObjectId(req.query['aid']) 
//     req.query['pid'] = Number(req.query['pid']) 
    
//     database.collection('Votetable').find(req.query).toArray((err, ans) => {

//         console.log("u----")
//         console.log(ans)
//         console.log("u----")

//         if (ans.length > 0) {
//             if (ans[0]['vote'] == 0) {
//                 console.log('vote0')
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 1 } }, (e1, r1) => {
//                     database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { downvotes: -1, upvotes: 1} })
//                 }) 
//             } else if (ans[0]['vote'] == 1) {
//                 console.log('vote1')
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 2 } }, (e1, r1) => {
//                     database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { upvotes: -1} })
//                 })
//             } else {
//                 console.log('vote2')
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 1 } }, (e1, r1) => {
//                     database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { upvotes: 1} })
//                 })
//             }
//         } else {
//             req.query['vote'] = 1
//             database.collection('Votetable').insertOne(req.query, (e1, r1) => {
//                 database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { upvotes: 1} })              
//             })
//         }
//     })
// })

// app.get('/adddownvote', (req, res) => {
//     console.log(req.query)
    
//     req.query['aid'] = ObjectId(req.query['aid']) 
//     req.query['pid'] = Number(req.query['pid']) 

//     database.collection('Votetable').find(req.query).toArray((err, ans) => {

//         console.log("d----")
//         console.log(ans)
//         console.log("d----")

//         if (ans.length > 0) {
//             // let flag = 0
//             // if (ans['vote'] == 0) {
//             //     ans['vote'] = 2
//             //     flag = 1
//             // } else if (ans['vote'] == 1) {
//             //     ans['vote'] = 0
//             //     flag = 2
//             // } else {
//             //     ans['vote'] = 0
//             //     flag = 3
//             // }
            
//             if (ans[0]['vote'] == 0) {
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 2 } })
//                 database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { downvotes: -1} })
//             } else if (ans[0]['vote'] == 1) {
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 0 } })
//                 database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { downvotes: 1, upvotes: -1} })
//             } else {
//                 database.collection('Votetable').updateOne(req.query, { $set: { vote: 0 } })
//                 database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { downvotes: 1} })
//             }

//         } else {
//             req.query['vote'] = 0
//             database.collection('Votetable').insertOne(req.query)
//             database.collection('Atable').updateOne({_id: req.query['aid']}, { $inc: { downvotes: 1} })            
//         }
//     })

// })

// app.get('/addvisit', (req, res) => {
//     // console.log(req.query)
//     if (req.query['pid'] != req.query['qpid']) {
//         let obj = {
//             qid: ObjectId(req.query['qid']),
//             pid: Number(req.query['pid'])
//         }

//         database.collection('Vtable').find(obj).toArray((err, ans1) => {
//             // console.log(ans1)

//             if (ans1.length == 0) {
//                 database.collection('Vtable').insertOne(obj)
//                 database.collection('Qtable').updateOne({ _id: ObjectId(req.query['qid']) }, { $inc: { visits: 1 } })
//             }
//             res.send({})
//         })
//     }
//     else {
//         res.send({})
//     }
// })

// app.get('/ansget', (req, res) => {

//     database.collection('Atable').find({ toquestion: req.query['qid'] }).sort({upvotes: -1, downvotes: -1}).toArray((err, answer1) => {
//         database.collection('Accounts').find({}).toArray((err, answer2) => {
//             database.collection('Votetable').find({pid: Number(req.query['pid'])}).toArray((err, answer3) => {

//                 console.log(answer3)

//                 let answer = []
//                 for (let i = 0; i < answer1.length; i++) {
//                     for (let j = 0; j < answer2.length; j++) {
//                         if (answer1[i].bywhom == answer2[j]._id) {
//                             let a1 = {...answer1[i]}
//                             let a2 = {...answer2[j]}
//                             let vote = -1;
//                             a1._aid = a1._id
//                             a2._pid = a2._id
//                             delete a1._id
//                             delete a2._id
//                             for(let k=0; k<answer3.length;k++) {
//                                 if (String(a1._aid) == String(answer3[k].aid)) {
//                                     vote = Number(answer3[k].vote)
//                                     break;
//                                 }
//                             }
//                             answer.push({ ...a1, ...a2, vote})                            
//                             break
//                         }
//                     }
//                 }

//                 console.log(answer)
//                 res.send(answer)

//             })    
//         })
//     })
// })

// app.post('/', (req, res) => {

//     // console.log('request comming')

//     if (Object.keys(req.body.qfilter).length != 0) {
//         if (req.body.qfilter['_id'] != undefined) {
//             req.body.qfilter['_id'] = ObjectId(req.body.qfilter['_id'])
//         }
//         if (req.body.qfilter['question'] != undefined) {
//             req.body.qfilter['question'] = new RegExp(req.body.qfilter['question'], 'i')
//         }
//     }

//     // console.log(req.body.qfilter)
//     // console.log(req.body.arrange)

//     database.collection("Qtable").find(req.body.qfilter).sort(req.body.arrange).toArray((err1, answer1) => {
//         database.collection("Accounts").find(req.body.filter).toArray((err2, answer2) => {
//             // console.log(`__ ${answer1} __`)
//             // console.log(answer1)
//             let answer = []
//             for (let i = 0; i < answer1.length; i++) {
//                 for (let j = 0; j < answer2.length; j++) {
//                     if (answer1[i].bywhom == answer2[j]._id) {
//                         let a1 = { ...answer1[i] }
//                         let a2 = { ...answer2[j] }
//                         a1._qid = a1._id
//                         a2._pid = a2._id
//                         delete a1._id
//                         delete a2._id
//                         answer.push({ ...a1, ...a2 })
//                         break
//                     }
//                 }
//             }
//             // console.log(answer)
//             // console.log('_____________')
//             res.send(answer)
//         })
//     })
// })

// app.post('/addquestion', (req, res) => {
//     // console.log(req.body)
//     database.collection('Qtable').insertOne(req.body)
// })

// app.post('/addans', (req, res) => {
//     database.collection('Qtable').updateOne({ _id: ObjectId(req.body.toquestion) }, { $inc: { answers: 1 } }, (error, response) => {
//         if (error) {
//             console.log("Error while adding answer")
//             res.send({})
//         } else {
//             database.collection('Atable').insertOne(req.body, (err1, res1) => {
//                 if (err1) {
//                     console.log("Error while adding answer")
//                 }
//                 res.send({})
//             })
//         }
//     })
// })

// app.listen(5000, '127.0.0.1', () => {

//     mongoclient.connect(conn_str, (err, res) => {
//         database = res.db("Project_AI")
//     })
//     console.log('server listening')
// })

const startApp = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(5000, console.log(`http://localhost:`+5000))
    } catch(err){
        console.log(err)
    }
}

startApp()