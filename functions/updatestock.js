const { getdata,getMedicine } = require('./GetMedicDetail.js');
const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')

async function updateMedData(LineID, updatedMedicines) {
    try {
        await connectToDatabase();
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
    } finally{
        await DisconnectToDatabase();
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
            return updateStockMed(LineID, medicine.MedicName);
        }));
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

async function updateStockMed(LineID, MedicName) {
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
    } finally{
        await DisconnectToDatabase();
      }
}

module.exports = {
    updateStockMed,
    updateStockall,
    updateMedData
}