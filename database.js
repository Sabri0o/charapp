require("dotenv").config();
const { MongoClient } = require("mongodb");

const URI = process.env["MONGO_URI"];

const db = async function () {
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
  } catch (e) {
    // Catch any errors
    console.error(e);
    throw new Error("Unable to Connect to Database");
  }
};

module.exports = db;
