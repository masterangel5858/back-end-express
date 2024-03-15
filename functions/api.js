const express = require('express');
const serverless = require('serverless-http');
const app = express();
const { MongoClient } = require('mongodb');
const router = express.Router();
const { getdata } = require('./findmongodb.js')
//Get all students
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

      // Log medicine data
      console.log(`Medicine data found for user ID: ${userId}. Medicine data:`, medicineData);

      // Filter medicine based on the time
      const filteredMedicine = medicineData.Medicine.filter(medicine => {
          return (time === 'Morning' && medicine.Morning) ||
                 (time === 'Noon' && medicine.Noon) ||
                 (time === 'Evening' && medicine.Evening);
      });

      // Log filtered medicine
      console.log(`Filtered medicine for ${time}:`, filteredMedicine);

      if (filteredMedicine.length === 0) {
          return res.send(`No medicine found for ${time}`);
      }
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      // Create a new table in the database to store the filtered medicine data
      const newTableData = filteredMedicine.map(medicine => ({
          LineID: userId,
          MedicName: medicine.MedicName,
          Morning: medicine.Morning,
          Noon: medicine.Noon,
          Evening: medicine.Evening,
          afbf: medicine.afbf,
          MedicPicture: medicine.MedicPicture,
          status: medicine.Status,
          timestamp: currentTime
      }));

      // Save newTableData to the database (implementation depends on your database setup)

      res.send(`User Id: ${userId} has accepted in ${time}. Filtered medicine data: ${JSON.stringify(newTableData)}`);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});





//showing demo records
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
