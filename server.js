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

const startApp = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(5000, console.log(`http://localhost:`+5000))
    } catch(err){
        console.log(err)
    }
}

startApp()