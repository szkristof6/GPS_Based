const db = require("./db");

const locations = db.get("locations");

module.exports = locations;