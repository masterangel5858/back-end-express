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
        } else {
            console.log("Already connected to MongoDB");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Propagate the error to the caller for handling
    }
}

async function DisconnectToDatabase() {
    try {
        if (isConnected) {
            await client.close();
            isConnected = false;
            console.log("Disconnected from MongoDB");
        } else {
            console.log("Already disconnected from MongoDB");
        }
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
        throw error; // Propagate the error to the caller for handling
    }
}

module.exports = {
    connectToDatabase,
    DisconnectToDatabase,
    client,
    dbName
};
