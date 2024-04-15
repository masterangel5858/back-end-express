const { getdata, getMedicine } = require('./GetMedicDetail.js');
const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');


async function updateMedData(LineID, updatedMedicines, db) {
    try {
        const col = db.collection("MedicDetail");

        // Update each document individually
        for (const updatedMedicine of updatedMedicines) {
            const filter = { LineID: LineID, 'Medicine.MedicName': updatedMedicine.MedicName };
            const update = { $set: { 'Medicine.$.stock': updatedMedicine.stock } };
            await col.updateOne(filter, update);
        }

        console.log('Medicine data updated successfully.');
    } catch (error) {
        console.error("Error updating medicine data:", error);
        throw error;
    }
}


// async function updateMedData(LineID, updatedMedicines) {
//     let db;

//     try {
//         db = client.db(dbName);

//         // Construct bulk write operations
//         const bulkOperations = updatedMedicines.map(updatedMedicine => ({
//             updateOne: {
//                 filter: { LineID: LineID, 'Medicine.MedicName': updatedMedicine.MedicName },
//                 update: { $set: { 'Medicine.$.stock': updatedMedicine.stock } }
//             }
//         }));

//         // Execute bulk write operations
//         const result = await db.collection("MedicDetail").bulkWrite(bulkOperations);

//         console.log('Medicine data updated successfully:', result);
//     } catch (error) {
//         console.error("Error updating medicine data:", error);
//         throw error;
//     }
// }

async function updateStockMed(LineID, MedicName) {
    try {
        const medicine = await getMedicine(LineID);
        await connectToDatabase(); // Ensure connection is established before proceeding
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
    } finally {
        await DisconnectToDatabase(); // Disconnect after operations are completed
    }
}

async function updateStockall(LineID, time) {
    try {
        const medicines = await getdata(LineID);
        await connectToDatabase(); // Ensure connection is established before proceeding
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
    } finally {
        await DisconnectToDatabase(); // Disconnect after operations are completed
    }
}

module.exports = {
    updateStockMed,
    updateStockall,
    updateMedData
};
