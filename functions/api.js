const express = require('express');
const app = express();
const port = process.env.PORT || 10000;
const router = express.Router();
const { getdata } = require('./GetMedicDetail.js');
const {  updateStockall,updateMedData, updateStockMed } = require('./updatestock.js');
const { insertData,updateOne,updateMany } = require('./insertMedicineLogs.js');
const {getFormattedDate} = require('./setting.js')
const {fetchuserdata} = require('./GetUser.js')
const {updateNotifyTime} = require('./GetNotifytime.js')
const {fetchMedDatabyDate,getMedDataByDate} = require('./GetMedDataByDate.js')
const { checkDuplicateLink } = require('./check-process.js');
const path = require('path'); // Import the path module
const { connectToDatabase, DisconnectToDatabase ,client} = require('./connecteddatabase.js');
const { fetchusermember,getmanageuser } = require('./GetManageUser.js')
const { link } = require('fs');
//html path setting
const successFilePath = path.join(__dirname, 'templates', 'success.html');
const nomedicine = path.join(__dirname, 'templates', 'no-medicine.html');
const loading = path.join(__dirname, 'templates', 'loading.html');
const Snooze = path.join(__dirname, 'templates', 'Snooze.html');
const sessionexpire = path.join(__dirname, 'templates', 'session-expire.html');
const mutipleclick = path.join(__dirname, 'templates', 'Mutipleclick.html');
//time config





router.get('/getmeddatabydate/:userid/:date/:time', async (req, res) => {
  const userId = req.params.userid;
  const date = req.params.date;
  const time = req.params.time; // New parameter for time

  try {
    // Fetch medication data for the specified user ID, date, and time
    const medicineData = await fetchMedDatabyDate(userId, date, time);

    if (!medicineData) {
      console.log(`No medicine data found for user ID: ${userId}`);
      return res.status(404).send(`No medicine data found for user ID: ${userId}`);
    }

    // Send the fetched medicine data as a response
    return res.json(medicineData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An unexpected error occurred.", error);
  } finally {
    // Disconnect from the database
    await DisconnectToDatabase();
  }
});


router.get('/getmanageuser/:userid', async (req,res)=>{
  const userId = req.params.userid;

  try {
    await connectToDatabase();
    const manageuser = await fetchusermember(userId);
    
    if (!manageuser || Object.keys(manageuser).length === 0) {
      console.log(`No user data found for user ID: ${userId}`);
      return res.send(`No user data found for user ID: ${userId}`);
    }
    
    // User data found, return it
    return res.json(manageuser);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An unexpected error occurred while fetching user data.");
  } finally{
    await DisconnectToDatabase();
  }

});


router.get('/', async (req, res) => {
  res.send("setup")
  
});



//***Route
//getdatauser/userid
router.get('/getdatauser/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
    await connectToDatabase();
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
  } finally{
    await DisconnectToDatabase();
  }
});


//***Route
//getdatamed/userid
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
      return res.status(500).send("An unexpected error occurred.",error);
  } finally {
    await DisconnectToDatabase();
  }
  
});



//***Route
//getdatamed/userid/time
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
    return res.status(500).send("An unexpected error occurred.",error);
  } finally{
    await DisconnectToDatabase();
  }
});


router.get('/getdatamed/:userid/:time/:date', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;
  const date = req.params.date;

  try {
    // Fetch all medicine data for the specified user ID
    const medicineData = await getdata(userId);

    if (!medicineData) {
      console.log(`No medicine data found for user ID: ${userId}`);
      return res.status(404).send(`No medicine data found for user ID: ${userId}`);
    }

    // Filter medicine based on the time and date
    const filteredMedicine = medicineData.Medicine.filter(medicine => {
      return (
        (time === 'Morning' && medicine.Morning) ||
        (time === 'Noon' && medicine.Noon) ||
        (time === 'Evening' && medicine.Evening)
      ) && medicine.MedicDate[date]; // Assuming 'MedicDate' is an object with date keys
    });

    if (filteredMedicine.length === 0) {
      return res.send(`No medicine found for ${time} on ${date}`);
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
    return res.status(500).send("An unexpected error occurred.", error);
  } finally {
    await DisconnectToDatabase();
  }
});



//Snoozeall
//snoozeall/userid/time
router.get('/snoozeall/:userid/:time/:timestamp', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;
  const timestamp = req.params.timestamp;

  try {
     // Check if the timestamp has expired
     const currentTime = new Date().getTime();
     const sessionTimeout = 10 * 60 * 1000; // 5 minutes in milliseconds
     const requestTime = parseInt(timestamp, 10); // Parse timestamp as integer
 
     if (currentTime - requestTime > sessionTimeout) {
       // Session has expired, return an error response
       return res.sendFile(sessionexpire);
     }
 
    
    // Call the updateNotifyTime function to update the notification time
    await updateNotifyTime(userId, time);

    // Redirect the user to the HTML page
    res.sendFile(Snooze);
  } catch (error) {
    // Handle errors
    console.error('Error snoozing all notifications:', error);
    res.status(500).send('An error occurred while snoozing all notifications.');
  }
});


//AcceptAll
//acceptall/:userid/:time
router.get('/acceptall/:userid/:time/:timestamp', async (req, res) => {
  const userId = req.params.userid;
  const time = req.params.time;
  const timestamp = req.params.timestamp;
  const url = req.url; // Use req.url directly
  let currentTimeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
  let currentDate = getFormattedDate();

  try {
    // Check if the timestamp has expired (similar to the Snoozeall route)
    const currentTime = new Date().getTime();
    const sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
    const requestTime = parseInt(timestamp, 10);

    if (currentTime - requestTime > sessionTimeout) {
      return res.sendFile(sessionexpire);
    }

    const isDuplicateLink = await checkDuplicateLink(url, userId);
    if (isDuplicateLink) {
      return res.sendFile(mutipleclick);
    }

    console.log('attempt accept all for ', userId);
    // Fetch medicine data for the specified user ID
    const medicineData = await getdata(userId);

    if (!medicineData) {
      return res.sendFile(successFilePath);
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

    // Prepare the update object
    const updateObject = {
      $set: {
        timestamp: currentTimeString,
        url: req.url,
        AcceptStatus: true
      }
    };

    // Prepare the filter for update
    const filter = {
      LineID: userId,
      MedicID: { $in: filteredMedicine.map(medicine => medicine.MedicID) },
      datestamp: currentDate,
      MatchedTime: time,
      AcceptStatus: { $ne: true } // Update only if AcceptStatus is not already true
    };

    await connectToDatabase();
    // Update multiple medicines with the updateMany function
    await updateMany(filter, updateObject);
    await DisconnectToDatabase();

    // Send the success page after completing the operation
    res.sendFile(successFilePath);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});

//Accept
//accept/userid/MedicID
router.get('/accept/:userid/:MedicID/:timestamp', async (req, res) => {
  const userId = req.params.userid;
  const MedicID = req.params.MedicID;
  const timestamp = req.params.timestamp;
  const url = req.url; // Use req.url directly
  const time = req.params.time;
  let currentTimeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
  let currentDate = getFormattedDate();

  try {
    console.log('attempt accept one for ' ,userId,MedicID);
    const currentTime = new Date().getTime();
    const sessionTimeout = 10 * 60 * 1000; // 5 minutes in milliseconds
    const requestTime = parseInt(timestamp, 10);

   if (currentTime - requestTime > sessionTimeout) {
       return res.sendFile(sessionexpire);
     }
     
     const isDuplicateLink = await checkDuplicateLink(url, userId);
        if (isDuplicateLink) {
          return res.sendFile(mutipleclick);
        }

    // Fetch medicine data for the specified user ID
    const medicineData = await getdata(userId);
    console.log('MedicineData', medicineData);
    console.log('MedicID', MedicID);

    if (!medicineData) {
      return res.status(404).send(`No medicine data found for user ID: ${userId}`);
    }

    // Find the medicine with the specified name
    const selectedMedicine = medicineData.Medicine.find(medicine => {
      return medicine.MedicID === MedicID;
    });

    if (!selectedMedicine) {
      return res.send(`No medicine found with the name: ${MedicID}`);
    }
    await updateStockMed(userId,MedicID);
    await connectToDatabase();
    const updateFilter = {
      LineID: userId,
      MedicID: MedicID,
      datestamp: currentDate,
      MatchedTime: time,
      AcceptStatus: { $ne: false } // Exclude documents where AcceptStatus is false
    };
    const updateData = {
      $set: {
        timestamp: currentTimeString,
        url: req.url,
        AcceptStatus: true
      }
    };
    await updateOne(updateFilter, updateData);
    await DisconnectToDatabase();

    // Send the success page after completing the operation
    res.sendFile(successFilePath);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An unexpected error occurred.");
  }
});




// app.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });

app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



module.exports = router;