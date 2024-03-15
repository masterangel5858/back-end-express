const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const { getdata } = require('./findmongodb.js');
const { insertData } = require('./insertmongodb.js');

router.get('/:userid/:time/accept', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;

  try {
    // Fetch medicine data for the specified user ID
    const medicineData = await getdata(userId);

    if (!medicineData) {
      return res.status(404).send(`No medicine data found for user ID: ${userId}`);
    }

    // Filter medicine based on the time
    const filteredMedicine = medicineData.Medicine.filter(medicine => {
      return (time === 'Morning' && medicine.Morning) ||
             (time === 'Noon' && medicine.Noon) ||
             (time === 'Evening' && medicine.Evening);
    });

    if (filteredMedicine.length === 0) {
      return res.send(`No medicine found for ${time}`);
    }

    // Get the current time in the format "hour:minute" in 24-hour format
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });

    // Insert each medicine into the database
    const insertedMedicines = [];
    for (const medicine of filteredMedicine) {
      const newMedicineData = {
        LineID: userId,
        MedicName: medicine.MedicName,
        Morning: medicine.Morning,
        Noon: medicine.Noon,
        Evening: medicine.Evening,
        afbf: medicine.afbf,
        MedicPicture: medicine.MedicPicture,
        status: medicine.Status,
        timestamp: currentTime
      };
      await insertData(newMedicineData);
      insertedMedicines.push(newMedicineData);
    }

    // Resend the success page
    const successFilePath = path.join(__dirname, 'templates', 'success.html');
    return res.sendFile(successFilePath);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
