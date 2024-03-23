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
        throw error; // Re-throw the error to handle it outside the function
    }
}
async function updateMedData(LineID, updatedMedicines) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("MedicDetail");

        // Loop through each updated medicine
        for (const updatedMedicine of updatedMedicines) {
            const filter = { LineID: LineID, 'Medicine.MedicName': updatedMedicine.MedicName };
            const updateOperation = { $set: { 'Medicine.$.stock': updatedMedicine.stock } };

            // Update the stock value of the medicine
            await col.updateOne(filter, updateOperation);
        }

        console.log('Medicine data updated successfully.');
    } catch (error) {
        console.error("Error updating medicine data:", error);
        throw error; // Re-throw the error to handle it outside the function
    } finally {
        // Close the connection
        await client.close();
    }
}
async function updateStockall(LineID, time) {
    try {
        const medicines = await getdata(LineID);

        // Check if medicines exist
        if (!medicines || !medicines.Medicine) {
            throw new Error('No medicine data found');
        }

        // Filter medicines that match the specified time
        const matchingMedicines = medicines.Medicine.filter(medicine => medicine[time]);

        // Update the stock of matching medicines concurrently
        await Promise.all(matchingMedicines.map(async (medicine) => {
            return updateMedicineStock(LineID, medicine.MedicName);
        }));
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

async function updateMedicineStock(LineID, MedicName) {
    try {
        const medicine = await getMedicine(LineID);

        // Check if medicine data exists
        if (!medicine || !medicine.Medicine) {
            throw new Error('No medicine data found');
        }

        // Find the medicine with the specified MedicName
        const targetMedicine = medicine.Medicine.find(med => med.MedicName === MedicName);

        // If the medicine is found, update its stock
        if (targetMedicine) {
            targetMedicine.stock -= 1; // Decrease the stock by 1

            // Update the medicine data in the database
            await updateMedData(LineID, [targetMedicine]);
            console.log(`Stock for medicine '${MedicName}' updated successfully.`);
        } else {
            throw new Error(`Medicine '${MedicName}' not found for LineID '${LineID}'`);
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

module.exports = {
    getdata,
    getMedicine,
    updateStockall,
    updateMedData,
    updateStockMed
};
