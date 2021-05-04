// this link is helpful https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database  
// Important: In MongoDB, a database is not created until it gets content! 

require("dotenv").config();
const { MongoClient } = require("mongodb");

const URI = process.env["MONGO_URI"];

const main = async function (callback) {
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
      await client.connect()
      await listDatabases(client); // list all databases
      await callback(client)
  } catch (error) {
      console.log(error)
      throw new Error('unable to connect to database')
  }
};

// function to list all databases in the cluster
const listDatabases = async function(client){
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

module.exports = main
