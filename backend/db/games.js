const db = require("./db");

const games = db.get("games");
games.createIndex({ name: 1 }, { unique: true });

module.exports = games;