const { MongoClient } = require("mongodb");
const { getdata } = require('./GetMedicDetail')

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";

async function getMedDataByDate(LineID, date) {
  try {
    const Data = await getdata(LineID);
    const MedData = Data.Medicine;

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("MedicineList");

    let result = [];

    // Loop through each entry in MedData
    for (const med of MedData) {
      const query = {
        "MedicID": med.MedicID, // Corrected MedicID query
        [`MedicDate.${date}`]: true,
      };
  
      const medResult = await col.findOne(query);
      if (medResult) {
        result.push(medResult);
      }
    }

    return result;
  } catch (err) {
    console.error("Error fetching Meddata:", err);
    throw err;
  } finally {
    await client.close();
  }
}

async function fetchMedDatabyDate(LineID, date) {
  try {
    const data = await getMedDataByDate(LineID, date); // Pass date parameter to getMedDataByDate
    console.log(data);

    // Handle the data retrieval here
    if (data.length === 0) {
      console.log("No data found for the specified date.");
      // Handle the case where no data is found
    } else {
      console.log("Data found:", data);
      // Process the data as needed
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    // Handle the error here
    throw err; // Re-throw the error for handling
  }
}

module.exports = {
  getMedDataByDate,
  fetchMedDatabyDate
};
