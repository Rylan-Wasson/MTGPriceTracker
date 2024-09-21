const axios = require('axios');
const fs = require('fs');

const fetchBulkCardData = async () => {
    console.log("Fetching bulk data...")
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
        const finishWriting = () => {
            return new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
        };

        // Pipe the response data to the write stream
        downloadResponse.data.pipe(writeStream);

        // Wait for the write stream to finish
        await finishWriting();

        console.log('Bulk data fetched successfully.');

    } catch (err) {
        console.error('Request error:', err);
    }   
}


function readData(filePath) {
    try {
        const data = fs.readFileSync('./bulkdata/output.json')
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