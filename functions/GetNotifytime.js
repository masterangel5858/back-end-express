const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:1234@healthcaredemo.nlwfzbm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "HealthCare";



async function getnotifydata(LineID) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection("NotifyTime");

    const document = await col.findOne({ LineID: LineID });


    return document;
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Move the client.close() inside the finally block
    await client.close();
  }
}


async function fetchnotifydata(LineID) {
    try {
      const documents = await getnotifydata(LineID);
      if (!documents) {
        console.error("No documents found");
        return [];
      }
  
      console.log("All Documents:\n", documents);
    } catch (innerError) {
        console.error("Error processing document:", innerError);
      }
    };

