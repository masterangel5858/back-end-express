const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";

// Variable to track the connection status
let isConnected = false;

async function connectToDatabase() {
    try {
        if (!isConnected) {
            // If not connected, establish a new connection
            await client.connect();
            isConnected = true;
            console.log("Connected to MongoDB");
        }
        else console.log("There is session Remain")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

async function DisconnectToDatabase() {
    try {
        if (!isConnected){
            await client.close();
            
        }
    } catch(err){
        console.log('error to disconected to database',err);
        throw err;
    }
}


module.exports = {
    connectToDatabase,
    DisconnectToDatabase,
    client,
    dbName
};