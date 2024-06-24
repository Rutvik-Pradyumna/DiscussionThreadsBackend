const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    byWhom : {
        type : String
    },
    question : {
        type : String
    },
    filters : [
        String
    ],
    branchFilter : {
        type : String
    },
    answers : {
        type : Number
    },
    visits : {
        type : Number
    },
    time : {
        type : String
    }
})

module.exports = mongoose.model('Question',questionSchema)