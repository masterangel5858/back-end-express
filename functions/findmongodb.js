const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";
async function getMedicine(userId) {
    try {
        await client.connect();
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
    } finally {
        // Close the connection
        await client.close();
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
    }
}

module.exports = {
    getdata,
    getMedicine
};
// Call the fetchMedicine function with the userid
