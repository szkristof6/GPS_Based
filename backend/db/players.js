const db = require("./db");

const players = db.get("players");

module.exports = players;