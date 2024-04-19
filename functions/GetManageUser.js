const { connectToDatabase, DisconnectToDatabase, client, dbName } = require('./connecteddatabase');
const { MongoClient } = require("mongodb");

async function getmanageuser(LineID) {
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const col = db.collection("ManageUser");

    const documents = await col.find({ User: LineID }).toArray(); // Use toArray() to get all matching documents
    return documents;
  } catch (err) {
    console.log(err.stack);
  } finally {
    await DisconnectToDatabase();
  }
}

async function fetchusermember(LineID) {
  try {
    const documents = await getmanageuser(LineID);
    if (!documents) {
      throw new Error("No documents found");
    }
    return documents;
  } catch (innerError) {
    console.error("Error processing document:", innerError);
    // Re-throw the error to propagate it to the caller
    throw innerError;
  }
}

module.exports = {
  fetchusermember,
  getmanageuser
};
