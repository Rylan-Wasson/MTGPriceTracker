const axios = require('axios');
const fs = require('fs');

const fetchBulkCardData = async () => {
    try {
        const apiUrl = 'https://api.scryfall.com/bulk-data/oracle-cards'

        const metaDataResponse = await axios({
            url: apiUrl,
            method: 'GET',
            headers:{
                'User-Agent': 'MTGPriceTracker',
                'Accept': 'application/json'
            }
        })
        const downloadUri = metaDataResponse.data.download_uri
        const downloadResponse = await axios({
            method:'GET',
            url: downloadUri,
            responseType: 'stream',
            headers:{
                'User-Agent': 'MTGPriceTracker',
                'Accept': 'application/json'
            }
        })
        const writeStream = fs.createWriteStream('./bulkdata/output.json'); // TODO magic filepath
        downloadResponse.data.pipe(writeStream)


    } catch (err) {
        console.error('Request error:', err);
    }   
}


function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath)
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading file', error)
        throw error
    }
}

module.exports = {
    fetchBulkCardData,
    readData
}