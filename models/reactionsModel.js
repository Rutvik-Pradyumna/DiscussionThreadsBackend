const mongoose = require('mongoose')

const reactionSchema = new mongoose.Schema({
    username : {
        type : String
    },
    answerId : {
        type : String
    },
    upvote : {
        type : Boolean,
        default : false
    },
    downvote : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Reaction',reactionSchema)