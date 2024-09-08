const cron = require('node-cron')
const readData = require('./DataService')
const {     
    updateAllCards, 
    uploadNewCards,
    uploadPrices,
    deletePrices
} = require('../db/CardOperations')
const filePath = '../bulkdata/output.json'

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
*/


function initCronJobs() {
    /*
    Once every day
    Update price information and delete stale data
    */
    cron.schedule('0 0 0 * * *', () => {
        const data = readData(filePath)
        uploadPrices(data)

        let thresholdDate = new Date(Date.now())
        thresholdDate.setDate(thresholdDate.getDate() - 31) // Magic number
        deletePrices(thresholdDate)
    })

    /*
    Once every 7 days
    Upload any fresh cards from the previous week
    */
    cron.schedule('0 0 0 */7 * *', () => {
        const data = readData(filePath)
        let thresholdDate = new Date(Date.now())
        thresholdDate.setDate(thresholdDate.getDate() - 7) // Magic Number
        
        uploadNewCards(data, thresholdDate)
    })

    /*
    Once a month
    Update any oracle changes to cards
    */
    cron.schedule('0 0 0 1 * *', () => {
        const data = readData(filePath)

        updateAllCards(data)
    })

}

module.exports = {
    initCronJobs
}