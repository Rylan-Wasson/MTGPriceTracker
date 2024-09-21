const mongoose = require('mongoose')

// TODO uris are nearly identical
const cardSchema = new mongoose.Schema({
    oracleID: String,
    name: String,
    imgSmallUri: String,
    imgNormalUri: String,
    imgLargeUri: String,
    imgPngUri: String
})

const priceSchema = new mongoose.Schema({
    oracleID: {type: String, required: true},
    priceUSD: { type: Number, default: null },
    date: {type: Date, default: Date.now()}
})

const Card = mongoose.model('Card', cardSchema)
const Price = mongoose.model('Price', priceSchema)

module.exports = {Card, Price}