const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');
const { MongoClient } = require("mongodb");

async function insertData(data) {
    try {
        console.log('try to insert data');
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs_UAT");

        // Insert the data into the collection
        const result = await col.insertOne(data);

        console.log(`Inserted ${result.insertedCount} document into the collection.`);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function updateOne(filter, update) {
    try {
        console.log('try to update data');
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs_UAT");

        // Update the document in the collection
        const result = await col.updateOne(filter, update);

        console.log(`${result.modifiedCount} document updated.`);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function updateMany(filter, update) {
    try {
        console.log('try to update multiple data');
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs_UAT");

        // Update multiple documents in the collection
        const result = await col.updateMany(filter, update);

        console.log(`${result.modifiedCount} documents updated.`);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

module.exports = {
    insertData,
    updateOne,
    updateMany
};
