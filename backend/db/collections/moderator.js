const db = require("../db");

const moderators = db.get("moderators");

module.exports = moderators;