const cron = require('node-cron')
const { readData, fetchBulkCardData } = require('./DataService')
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

async function initCronJobs() {
    /*
    Once every day
    Update price information and delete stale data
    */
    cron.schedule('0 0 0 * * *', async () => {
        try {
            await fetchBulkCardData()
            
            const data = readData(filePath)
            await uploadPrices(data)

            let thresholdDate = new Date(Date.now())
            thresholdDate.setDate(thresholdDate.getDate() - 31) // Magic number
            await deletePrices(thresholdDate)
        } catch (err) {
            console.error('Error in daily cron job:', err)
        }
    })

    /*
    Once every 7 days
    Upload any fresh cards from the previous week
    */
    cron.schedule('0 0 0 */7 * *', async () => {
        try {
            const data = readData(filePath)
            let thresholdDate = new Date(Date.now())
            thresholdDate.setDate(thresholdDate.getDate() - 7) // Magic Number
            
            await uploadNewCards(data, thresholdDate)
        } catch (err) {
            console.error('Error in weekly cron job:', err)
        }
    })

    /*
    Once a month
    Update any oracle changes to cards
    */
    cron.schedule('0 0 0 1 * *', async () => {
        try {
            const data = readData(filePath)

            await updateAllCards(data)
        } catch (err) {
            console.error('Error in monthly cron job:', err)
        }
    })
}

module.exports = {
    initCronJobs
}
