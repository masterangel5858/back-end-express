const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const { getdata } = require('./findmongodb.js');
const { insertData } = require('./insertmongodb.js');
const path = require('path');

// Function to handle the accept request
async function handleAcceptRequest(userId, time, res) {
  try {
      console.log('Fetching medicine data...');
      const medicineData = await getdata(userId);

      if (!medicineData) {
          console.log(`No medicine data found for user ID: ${userId}`);
          return res.status(404).send(`No medicine data found for user ID: ${userId}`);
      }

      // Filter medicine based on the time
      const filteredMedicine = medicineData.Medicine.filter(medicine => {
          return (time === 'Morning' && medicine.Morning) ||
                 (time === 'Noon' && medicine.Noon) ||
                 (time === 'Evening' && medicine.Evening);
      });

      if (filteredMedicine.length === 0) {
          console.log(`No medicine found for ${time}`);
          return res.send(`No medicine found for ${time}`);
      }

      console.log('Inserting medicine data into the database...');
      // Insert each medicine into the database
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
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

      console.log('Medicine data inserted successfully!');
      // Resend the success page
      const successFilePath = path.join(__dirname, 'templates', 'success.html');
      return res.sendFile(successFilePath);
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("An unexpected error occurred.");
  }
}

// Route to handle the accept request
router.get('/:userid/:time/accept', async (req, res) => {
    const userId = req.params.userid;
    const time = req.params.time;

    try {
        // Fetch medicine data for the specified user ID
        const medicineData = await getdata(userId);
        
        if (!medicineData) {
            console.log(`No medicine data found for user ID: ${userId}`);
            return res.status(404).send(`No medicine data found for user ID: ${userId}`);
        }

        // Show the loading page while processing
        const loadingPath = path.join(__dirname, 'templates', 'loading.html');
        res.sendFile(loadingPath);

        // Call the function to handle the accept request
        await handleAcceptRequest(userId, time, res);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("An unexpected error occurred.");
    }
});

// Mount the router
app.use('/.netlify/functions/api', router);

// Export the server
module.exports.handler = serverless(app);
