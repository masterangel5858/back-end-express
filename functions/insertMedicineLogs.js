const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");

async function insertData(data) {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs");

        // Insert the data into the collection
        const result = await col.insertOne(data);

        console.log(`Inserted ${result.insertedCount} document into the collection.`);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await DisconnectToDatabase();
    }
}

module.exports = {
    insertData
};