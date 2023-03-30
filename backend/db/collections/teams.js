const db = require("../db");

const teams = db.get("teams"); // Az adatbázisból lekérjük az users táblát

module.exports = teams;