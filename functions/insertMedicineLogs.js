const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");

async function insertData(data) {
    try {
        console.log('try to insert data');
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
        console.log('insert data completed');
        await DisconnectToDatabase();
    }
}

module.exports = {
    insertData
};