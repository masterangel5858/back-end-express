const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");

//acceptall/:userid/:time/:timestamp
//accept/userid/MedicID/:timestamp

async function checkDuplicateLink(Accepttype,urltime, userId,time,MedicID) {
    try {
        await connectToDatabase();
        console.log("checking link process for ",url , userId);
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs_UAT");

        if (Accepttype==="accept"){
            var existingLog = await col.findOne({
                MedicID:MedicID,
                urltime,
                LineID: userId,
            });
        }
        else if (Accepttype==="acceptall"){
            var existingLog = await col.findOne({
                MatchedTime:time,
                urltime,
                LineID: userId,
            });
        }
        // Check if a document with the same link, userId, and time exists within the time range
        

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