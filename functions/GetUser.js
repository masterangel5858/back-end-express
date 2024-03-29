const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";



async function getuserdata(LineID) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("User");

    const document = await col.findOne({ LineID: LineID });
    return document;
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Move the client.close() inside the finally block
    await client.close();
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
