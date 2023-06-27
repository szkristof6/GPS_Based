const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db("airtrk");

module.exports = { database };
