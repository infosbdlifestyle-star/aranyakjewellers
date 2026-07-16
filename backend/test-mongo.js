const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://santrarony9_db_user:admin123@cluster0.txixvnj.mongodb.net/aranyak_jewellers?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
