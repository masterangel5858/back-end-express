const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const { getdata } = require('./GetMedicDetail.js');
const { insertData } = require('./insertMedicineLogs.js');
const {getFormattedDate} = require('./setting.js')
const {fetchuserdata} = require('./GetUser.js')
const {updateNotifyTime} = require('./GetNotifytime.js')
const path = require('path'); // Import the path module
//html path setting
const successFilePath = path.join(__dirname, 'templates', 'success.html');
const snoozeFilePath = path.join(__dirname, 'templates', 'Snooze.html');
const nomedicine = path.join(__dirname, 'templates', 'no-medicine.html');
const loading = path.join(__dirname, 'templates', 'loading.html');
//time config
const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
const currentDate = getFormattedDate();

router.get('/getdatauser/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
    const userData = await fetchuserdata(userId);
    
    // Check if userData is empty or null
    if (!userData || Object.keys(userData).length === 0) {
      console.log(`No user data found for user ID: ${userId}`);
      return res.send(`No user data found for user ID: ${userId}`);
    }

    // User data found, return it
    return res.json(userData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An unexpected error occurred while fetching user data.");
  }
});



router.get('/snoozeall/:userid/:time', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;

  try {
    // Call the updateNotifyTime function to update the notification time
    await updateNotifyTime(userId, time);

    // Redirect the user to the HTML page
    res.sendFile(snoozeFilePath); // Change the path to your actual HTML page
  } catch (error) {
    // Handle errors
    console.error('Error snoozing all notifications:', error);
    res.status(500).send('An error occurred while snoozing all notifications.');
  }
});


//test

router.get('/acceptall/:userid/:time', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;

  try {
    // Fetch medicine data for the specified user ID
    const medicineData = await getdata(userId);

    if (!medicineData) {
      return res.status(404).sendFile(nomedicine);
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
        datestamp: currentDate,
        timestamp: currentTime
      };
      await insertData(newMedicineData);
      insertedMedicines.push(newMedicineData);
    }

    // Send the success page after completing the operations
    res.sendFile(successFilePath);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});

router.get('/accept/:userid/:MedicName', async (req, res) => {
  const userId = req.params.userid;
  const medicName = req.params.MedicName;

  try {
    // Fetch medicine data for the specified user ID
    const medicineData = await getdata(userId);
    console.log('MedicineData', medicineData);
    console.log('MedicName', medicName);

    if (!medicineData) {
      return res.status(404).send(`No medicine data found for user ID: ${userId}`);
    }

    // Find the medicine with the specified name
    const selectedMedicine = medicineData.Medicine.find(medicine => {
      return medicine.MedicName === medicName;
    });

    if (!selectedMedicine) {
      return res.send(`No medicine found with the name: ${medicName}`);
    }

    const newMedicineData = {
      LineID: userId,
      MedicName: selectedMedicine.MedicName,
      Morning: selectedMedicine.Morning,
      Noon: selectedMedicine.Noon,
      Evening: selectedMedicine.Evening,
      afbf: selectedMedicine.afbf,
      MedicPicture: selectedMedicine.MedicPicture,
      Status: selectedMedicine.Status,
      datestamp: currentDate,
      timestamp: currentTime
    };

    await insertData(newMedicineData);

    // Send the success page after completing the operation
    res.sendFile(successFilePath);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});





router.get('/getdatamed/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
      // Fetch all medicine data for the specified user ID
      const medicineData = await getdata(userId);
      
      if (!medicineData) {
          console.log(`No medicine data found for user ID: ${userId}`);
          return res.status(404).send(`No medicine data found for user ID: ${userId}`);
      }

      // Send the fetched medicine data as a response
      return res.json(medicineData);
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("An unexpected error occurred.");
  }
});
router.get('/getdatamed/:userid/:time', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;

  try {
    // Fetch all medicine data for the specified user ID
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
      return res.send(`No medicine found for ${time}`);
    }

    // Create a response object with the original format
    const response = {
      _id: medicineData._id,
      LineID: medicineData.LineID,
      Medicine: filteredMedicine
    };

    // Send the response
    return res.json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An unexpected error occurred.");
  }
});





app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);