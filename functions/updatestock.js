const { error } = require('console');
const { getdata, getMedicine } = require('./GetMedicDetail.js');
const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');


async function updateMedData(updatedMedicines) {
    try {
        console.log(updateMedData);
        const db = client.db(dbName);
        const col = db.collection("MedicineList");
        // Update each document individually
        // Construct bulk write operations
        const bulkOperations = updatedMedicines.map(updatedMedicine => ({
            updateOne: {
                filter: {'MedicID': updatedMedicine.MedicID },
                update: { $set: { 'stock': updatedMedicine.stock } }
            }
        }))

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

    // async function updateMedData(LineID, updatedMedicines) {
    //     try {
    //         await connectToDatabase();
    //         const db = client.db(dbName);
    //         const col = db.collection("MedicDetail");
    
    //         // Loop through each updated medicine
    //         for (const updatedMedicine of updatedMedicines) {
    //             const filter = { LineID: LineID, 'Medicine.MedicName': updatedMedicine.MedicName };
    //             const updateOperation = { $set: { 'Medicine.$.stock': updatedMedicine.stock } };
    
    //             // Update the stock value of the medicine
    //             await col.updateOne(filter, updateOperation);
    //         }
    
    //         console.log('Medicine data updated successfully.');
    //     } catch (error) {
    //         console.error("Error updating medicine data:", error);
    //         throw error; // Re-throw the error to handle it outside the function
    //     } finally{
    //         await DisconnectToDatabase();
    //       }
    // }
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

async function updateStockMed(LineID, MedicID) {
    try {
        const medicine = await getMedicine(LineID);
        console.log('update stock by one ',LineID,MedicID)

        await connectToDatabase();
        if (!medicine || !medicine.Medicine) {
            throw new Error('No medicine data found');
        }

        const targetMedicine = medicine.Medicine.find(med => med.MedicID === MedicID);

        if (targetMedicine) {
            if (targetMedicine.Status === true){
                targetMedicine.stock -= 1;
             console.log(targetMedicine);

                let packedmedicine = { MedicID: targetMedicine.MedicID, stock: targetMedicine.stock };
                if (targetMedicine.stock === 0) {
                    packedmedicine.Status = false;
                }
            console.log("package",packedmedicine)
            await updateMedData([packedmedicine]);
            
            console.log(`Stock for medicine '${MedicID}' updated successfully.`);
            }
            else { console.error(`Medicine ${MedicID} is Disable`)}
        } else {
            throw new Error(`Medicine '${MedicID}' not found for LineID '${LineID}'`);
        }
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    } finally{
        console.log("update stock by one Done");
        await DisconnectToDatabase();
      }
}

async function updateStockall(LineID, time) {
    try {
        const medicines = await getdata(LineID);
        console.log('update stock by all ',LineID,time)
        await connectToDatabase();
        if (!medicines || !medicines.Medicine) {
            throw new Error('No medicine data found');
        }

        const matchingMedicines = medicines.Medicine.filter(medicine => medicine[time]);

        // Sequentially update the stock of matching medicines
        for (const medicine of matchingMedicines) {
            await updateStockMed(LineID, medicine.MedicID);
        }

        // // Update the stock of matching medicines concurrently
// await Promise.all(matchingMedicines.map(async (medicine) => {
//     return updateStockMed(LineID, medicine.MedicName);

    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    } finally{
        console.log("update stock by all Done");
        await DisconnectToDatabase();
      }
}



module.exports = {
    updateStockMed,
    updateStockall,
    updateMedData
};
