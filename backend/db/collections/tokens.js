const db = require("../db");

const tokens = db.get("tokens"); // Az adatbázisból lekérjük az users táblát
tokens.createIndex({ user_id: 1 }, { unique: true }); //

module.exports = tokens;

/*
user_id
token
createdAt
*/