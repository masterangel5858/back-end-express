const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");

async function getMedicine(userId) {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const col = db.collection("MedicDetail");

        // Fetch documents for the given userId
        const document = await col.findOne({ LineID: userId });

        // Return the Medicine array if document exists
        if (document && Array.isArray(document.Medicine)) {
            return {
                _id: document._id,
                LineID: document.LineID,
                Medicine: document.Medicine
            };
        } else {
            return null; // Return null if no matching document or Medicine array
        }

    } catch (error) {
        console.error("Error:", error);
        throw error; // Re-throw the error to handle it outside the function
    } finally{
        await DisconnectToDatabase();
      }
}

/**
 * find Med data that contain userid
 * @param {string} userId 
 */
// Call the function and handle the result using await or .then()
async function getdata(userId) {
    try {
        const medicines = await getMedicine(userId); // Wait for the promise to resolve
        return medicines;
    } catch (error) {
        console.error("Error fetching medicine data:", error);
        throw error; // Re-throw the error to handle it outside the function
    }
}


module.exports = {
    getdata,
    getMedicine
};

