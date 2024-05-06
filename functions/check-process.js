const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");


async function checkDuplicateLink(url, userId) {
    try {
        await connectToDatabase();
        console.log("checking link process for ",url , userId);
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs_UAT");

        // Check if a document with the same link, userId, and time exists within the time range
        const existingLog = await col.findOne({
            url,
            LineID: userId
        });

        return existingLog !== null; // Return true if a duplicate log is found, false otherwise
    } catch (error) {
        console.error("Error checking duplicate link:", error);
        throw error;
    } finally {
        console.log("checking link process done");
        await DisconnectToDatabase();
    }
}


module.exports = {
    checkDuplicateLink
};