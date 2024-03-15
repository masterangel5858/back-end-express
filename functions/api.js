const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const { insertData } = require('./insertmongodb');
const {getdata} = require('./findmongodb')

// Route to handle the request
router.get('/:userid/:time/accept', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;

  try {
      // Show the loading page while processing
      res.sendFile('./templates/loading.html');

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
          return res.sendFile('./templates/no-medicine.html');
      }

      // Insert data into the database
      await insertData(filteredMedicine);

      // Redirect to the success page after 5 seconds
      setTimeout(function() {
        res.redirect('./templates/success.html');
      }, 5000);
      
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An unexpected error occurred.");
  }
});

// Mount the router
app.use('/.netlify/functions/api', router);

// Export the server
module.exports.handler = serverless(app);
