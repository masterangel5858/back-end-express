const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";


async function insertData(data) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("MedicineLogs");

        // Insert the data into the collection
        const result = await col.insertOne(data);

        console.log(`Inserted ${result.insertedCount} document into the collection.`);
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await client.close();
    }
}
