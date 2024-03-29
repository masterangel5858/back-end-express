const { getdata, getMedicine } = require('./GetMedicDetail.js');
const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');

async function updateMedData(LineID, updatedMedicines) {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const col = db.collection("MedicDetail");

        // Construct bulk write operations
        const bulkOperations = updatedMedicines.map(updatedMedicine => ({
            updateOne: {
                filter: { LineID: LineID, 'Medicine.MedicName': updatedMedicine.MedicName },
                update: { $set: { 'Medicine.$.stock': updatedMedicine.stock } }
            }
        }));

        // Execute bulk write operations
        await col.bulkWrite(bulkOperations);

        console.log('Medicine data updated successfully.');
    } catch (error) {
        console.error("Error updating medicine data:", error);
        throw error;
    } finally {
        await DisconnectToDatabase();
    }
}

async function updateStockMed(LineID, MedicName) {
    try {
        const medicine = await getMedicine(LineID);

        if (!medicine || !medicine.Medicine) {
            throw new Error('No medicine data found');
        }

        const targetMedicine = medicine.Medicine.find(med => med.MedicName === MedicName);

        if (targetMedicine) {
            targetMedicine.stock -= 1;

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

async function updateStockall(LineID, time) {
    try {
        const medicines = await getdata(LineID);

        if (!medicines || !medicines.Medicine) {
            throw new Error('No medicine data found');
        }

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

module.exports = {
    updateStockMed,
    updateStockall,
    updateMedData
};
