const {connectToDatabase,DisconnectToDatabase,client,dbName} = require('./connecteddatabase')
const { MongoClient } = require("mongodb");


async function getuserdata(LineID) {
  try {
    await connectToDatabase();
    const db = client.db(dbName);
    const col = db.collection("User");

    const document = await col.findOne({ LineID: LineID });
    return document;
  } catch (err) {
    console.log(err.stack);
  } finally {
    await DisconnectToDatabase();
  }
}

async function fetchuserdata(LineID) {
  try {
      const documents = await getuserdata(LineID);
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
        fetchuserdata,
        getuserdata
    };
