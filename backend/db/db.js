const monk = require("monk");
require("dotenv").config();

/*
Az adatbázisunk MongoDB alapú, amivel egy monk nevezetű könyvtár segítségével kommunikálunk
*/

const db = monk(process.env.MONGO_URI);

module.exports = db;