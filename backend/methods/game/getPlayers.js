const Player = require("../../collections/player");
const User = require("../../collections/user");
const Team = require("../../collections/team");
const Location = require("../../collections/location");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Majd lekérdezzük a játékos játék azonosítója alapján a játékban lévő játékosokat
  Ebből a listából kivesszük a felhasználó adatait, hogy csak a többi játékos legyen megjelenítve a térképen

Majd visszaadjuk a végleges listát a felhasznló képével együtt
*/

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const players = await Player.find({ game_id }, { projection: { user_id: 1, team_id: 1, location_id: 1 } });
		if (!players) return res.code(400).send({ status: "error", message: "There are zero players in this game!" });

		const cleaned = new Array(); // Létrehozunk egy üres listát

		for (const player of players) {
			if (player.user_id !== req.user.user_id) {
				const user = await User.findOne({ _id: player.user_id }, { projection: { name: 1, image: 1 } });
				const team = await Team.findOne({ _id: player.team_id }, { projection: { image: 1 } });
				const location = await Location.findOne({ _id: player.location_id }, { projection: { location: 1 } });

				cleaned.push({ user, team, location });
			}
		}

		return res.send({ status: "success", count: cleaned.length, players: cleaned });
	} catch (error) {
		return res.send(error);
	}
};
