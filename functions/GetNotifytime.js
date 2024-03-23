const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";

// async function updateNotifyTime(LineID, Time, existingTime) {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     const col = db.collection("NotifyTime");

//     // Convert the existing time to hours and minutes
//     const [existingHour, existingMinute] = existingTime;

//     // Increment the existing minute by 10
//     let updatedMinute = parseInt(existingMinute) + 10;
//     let updatedHour = existingHour;

//     // Check if the updated minute exceeds 59, increment hour and reset minutes
//     if (updatedMinute > 59) {
//       updatedMinute -= 60;
//       updatedHour = parseInt(existingHour) + 1;
//     }

//     // Convert the updated hour and minute back to string format
//     updatedHour = updatedHour.toString().padStart(2, "0");
//     updatedMinute = updatedMinute.toString().padStart(2, "0");

//     // Construct the updated time array
//     const updatedTime = [updatedHour, updatedMinute];

//     // Construct the update object based on the provided Time parameter
//     const updateObj = {};
//     updateObj[Time] = updatedTime;

//     // Update the document matching the LineID
//     const result = await col.updateOne(
//       { LineID: LineID },
//       { $set: updateObj }
//     );

//     console.log(`${result.matchedCount} document(s) matched the query criteria.`);
//     console.log(`${result.modifiedCount} document(s) was/were updated.`);
//   } catch (err) {
//     console.error("Error updating document:", err);
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// }

// // Example usage
// const userID = "U33cd6913cb1d26a21f1f83b1a3bd7638"; // Replace with the actual user ID
// const Time = "Evening"; // Specify the time field (Morning, Noon, or Evening)
// const existingTime = ["17", "55"]; // Existing time value
// updateNotifyTime(userID, Time, existingTime);



async function updateNotifyTime(LineID, Time) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("NotifyTime");

    // Find the document matching the LineID
    const document = await col.findOne({ LineID: LineID });

    if (!document) {
      console.error("No document found for LineID:", LineID);
      return;
    }

    // Get the existing time value for the specified Time
    const existingTime = document[Time];

    // Convert the existing time to hours and minutes
    const [existingHour, existingMinute] = existingTime;

    // Increment the existing minute by 10
    let updatedMinute = parseInt(existingMinute) + 10;
    let updatedHour = existingHour;

    // Check if the updated minute exceeds 59, increment hour and reset minutes
    if (updatedMinute > 59) {
      updatedMinute -= 60;
      updatedHour = parseInt(existingHour) + 1;
    }

    // Convert the updated hour and minute back to string format
    updatedHour = updatedHour.toString().padStart(2, "0");
    updatedMinute = updatedMinute.toString().padStart(2, "0");

    // Construct the updated time array
    const updatedTime = [updatedHour, updatedMinute];

    // Construct the update object based on the provided Time parameter
    const updateObj = {};
    updateObj[Time] = updatedTime;

    // Update the document matching the LineID
    const result = await col.updateOne(
      { LineID: LineID },
      { $set: updateObj }
    );

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  } catch (err) {
    console.error("Error updating document:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// // Example usage
// const userID = "U33cd6913cb1d26a21f1f83b1a3bd7638"; // Replace with the actual user ID
// const Time = "Evening"; // Specify the time field (Morning, Noon, or Evening)
// updateNotifyTime(userID, Time);


  module.exports = {
    updateNotifyTime
  };