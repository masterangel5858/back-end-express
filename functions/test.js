const { MongoClient } = require('mongodb');




const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const dbName = "HealthCare";
const collectionName = 'MedicineList'; // Name of your collection
async function main() {
    let client;

    try {
        // Connect to MongoDB
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        console.log('Connected to MongoDB');

        // Select the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Update documents in the collection
        const filter = { MedicID: 'M-240419213145490-1834031' }; // Filter to match documents
        const update = { $set: { stock: 50 } }; // Update operation


        const result = await collection.updateOne(filter, update);
        console.log('Documents updated:', result.modifiedCount);
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        // Disconnect from MongoDB
        if (client) {
            await client.close();
            console.log('Disconnected from MongoDB');
        }
    }
}

main();