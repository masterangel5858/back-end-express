const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')

//acceptall/:userid/:time/:timestamp
//accept/userid/MedicID/:timestamp

async function checkDuplicateLink(Accepttype, urltime, userId, time, MedicID) {
    try {
        await connectToDatabase();
        console.log("Checking duplicate link process for ", Accepttype, urltime, userId);
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs");

        let query = {
            LineID: userId,
            AcceptStatus: { $ne: false }
        };

        if (Accepttype === "accept") {
            query = {
                ...query,
                MedicID: MedicID,
                urltime: urltime 
            };
        } else if (Accepttype === "acceptall") {
            query = {
                ...query,
                MatchedTime: time,
                urltime: urltime 
            };
        }

        const existingLog = await col.findOne(query);

        return existingLog !== null; // Return true if a duplicate log is found, false otherwise
    } catch (error) {
        console.error("Error checking duplicate link:", error);
        throw error;
    } finally {
        console.log("Checking link process done");
        await DisconnectToDatabase();
    }
}

module.exports = {
    checkDuplicateLink
};
