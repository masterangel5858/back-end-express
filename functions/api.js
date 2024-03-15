const express = require('express');
const serverless = require('serverless-http');
const app = express();
const { MongoClient } = require('mongodb');
const router = express.Router();
const { getdata } = require('./findmongodb.js');
const { insertData } = require('./insertData.js'); // Assuming you have an insertData function

// Get all students
router.get('/', (req, res) => {
  res.send('App is running..');
});

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
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

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

    res.send(`User Id: ${userId} has accepted in ${time}. Filtered medicine data: ${JSON.stringify(insertedMedicines)}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});

// Showing demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'lily',
      email: 'lily@gmail.com',
    },
  ]);
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
