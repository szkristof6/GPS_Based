const { ObjectId } = require("mongodb");

const OutsideArea = require("./outsideArea");

const Player = require("../../collections/player");
const User = require("../../collections/user");
const Team = require("../../collections/team");
const Location = require("../../collections/location");
const Map = require("../../collections/map");

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

		const players = await Player.find({ game_id }).toArray();
		if (!players) return res.code(400).send({ status: "error", message: "There are zero players in this game!" });

		const cleaned = new Array(); // Létrehozunk egy üres listát

		for (const player of players) {
			// player.user_id !== req.user.user_id
			if (player.user_id !== req.user.user_id) {
				const user = User.findOne({ _id: new ObjectId(player.user_id) });
				const team = Team.findOne({ _id: new ObjectId(player.team_id) });
				const location = Location.findOne({ _id: new ObjectId(player.location_id) });
				const map = await Map.findOne({game_id: player.game_id });

				await Promise.all([user, team, location]).then(function (values) {
					const user = {
						name: values[0].name,
						image: values[0].image,
					}
					const team = {
						color: values[1].color,
						image: values[1].image
					}
					const location = {
						x: values[2].location.x,
						y: values[2].location.y
					}
					
					const outside = OutsideArea(map.location, location);

					cleaned.push({user, team, location, outside });
				});
			}
		}

		return res.send({ status: "success", count: cleaned.length, players: cleaned });
	} catch (error) {
		return res.send(error);
	}
};
