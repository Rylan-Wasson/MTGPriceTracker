const { Price, Card } = require("../models/CardModels");

// Update all cards in database, very slow
async function updateAllCards(data) {
    // upload new cards/update any changes
    try {
        console.log("Attempting to upload cards...")
        // build operations to send to db
        const bulkOps = data.map(card => ({
            updateOne: {
                filter: { oracleID: card.oracle_id },
                update: {
                    $set: {
                        name: card.name,
                        imgSmallUri: card.image_uris?.small ?? null,
                        imgNormalUri: card.image_uris?.normal ?? null,
                        imgLargeUri: card.image_uris?.large ?? null,
                        imgPngUri: card.image_uris?.png ?? null
                    }
                },
                upsert: true
            }
        }));

        // Perform the bulk operation
        const result = await Card.bulkWrite(bulkOps, { ordered: true });
    } catch (error) {
        console.error('Error Updating All Cards: ', error);
        throw error;
    }
    console.log('Cards Updated.');
}

/* 
Add new cards to database
data: json object containing all cards
date threshold: oldest date to be considered "new", should be a date object
TODO is this just an extension of update all?
*/
async function uploadNewCards(data, dateThreshold) {
    try {

        console.log("Uploading new cards...")
        const threshold = new Date(dateThreshold)

        // filter new cards
        const newCards = data.filter(card => {
            const releaseDate = new Date(card.released_at)
            return releaseDate >= threshold
        })

        const bulkOps = newCards.map(card => ({
            updateOne: {
                filter: { oracleID: card.oracle_id },
                update: {
                    $set: {
                        // TODO, may be able to set default values to null
                        name: card.name,
                        imgSmallUri: card.image_uris?.small ?? null,
                        imgNormalUri: card.image_uris?.normal ?? null,
                        imgLargeUri: card.image_uris?.large ?? null,
                        imgPngUri: card.image_uris?.png ?? null
                    }
                },
                upsert: true
            }
        }))
        
        // Perform the bulk operation
        const result = await Card.bulkWrite(bulkOps, { ordered: true });
    } catch (error) {
        console.error('Error Uploading New Cards: ', error);
        throw error;
    }
    console.log("New Cards Uploaded")
}

async function uploadPrices(data){
    console.log("Uploading price data...")
    try {
        const bulkOps = data.map(card => ({
            insertOne: {
                document : {
                    oracleID: card.oracle_id,
                    priceUSD: card.prices.used,
                    date: Date.now()
                }
            }
        }))

        const result = await Price.bulkWrite(bulkOps)
        console.log("Prices Uploaded. Num uploaded: ", result.insertedCount)
    } catch (error) {
        console.error('Error uploading prices: ', error)
        throw error
    }
}

module.exports = {
    updateAllCards, 
    uploadNewCards,
    uploadPrices
}