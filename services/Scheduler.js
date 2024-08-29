const cron = require('node-cron')
const {     
    updateAllCards, 
    uploadNewCards,
    uploadPrices 
} = require('../db/CardOperations')

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
    */
    cron.schedule('0 0 0 * * *', () => {
        
    })

    /*
    Once every 7 days
    */
    cron.schedule('0 0 0 */7 * *', () => {

    })

    /*
    Once a month
    */
    cron.schedule('0 0 0 1 * *', () => {

    })

}