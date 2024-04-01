const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://imalgoubri2:Ilovedatabases88@cluster0.et25buk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = {
  client,
  connectToDatabase,
};