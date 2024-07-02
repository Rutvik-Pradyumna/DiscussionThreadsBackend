const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    byWhom : {
        type : String
    },
    description : {
        type : String
    },
    upvotes : {
        type : Number
    },
    downvotes : {
        type : Number
    },
    time : {
        type : String
    }
})

module.exports = mongoose.model('Answer',answerSchema)