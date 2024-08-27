require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios').default
const mongoose = require('mongoose')
const fs = require('fs')
const {Card, Price } = require('./models/CardModels')



// connect to db
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Mongo DB connection error: ', err))


// fetchBulkCardData()
const cards = readData('./bulkdata/output.json')

uploadPrices(cards)
app.get('/', (req, res) => {
    res.send('Hello there')
})

app.listen(port, () => {
    console.log(`MTGPrices listening on port ${port}`)
})