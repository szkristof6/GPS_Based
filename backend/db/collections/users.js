const db = require("../db");

const users = db.get("users"); // Az adatbázisból lekérjük az users táblát
users.createIndex({ email: 1 }, { unique: true }); //

module.exports = users;