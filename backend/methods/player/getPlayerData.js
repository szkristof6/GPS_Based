const Player = require("../../collections/player");
const User = require("../../collections/user");
const Game = require("../../collections/game");
const Team = require("../../collections/team");
const Location = require("../../collections/location");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.p_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { p_id: player_id } = req.query;

		const player = await Player.findOne({ _id: player_id }, { projection: { point: 1 } });
		const user = await User.findOne({ _id: player.user_id }, { projection: { name: 1, image: 1, permission: 1 } });
		const game = await Game.findOne({ _id: player.game_id }, { projection: { name: 1, gamemode: 1, location: 1, date: 1 } });
		const team = await Team.findOne({ _id: player.team_id }, { projection: { name: 1, point: 1, image: 1 } });
		const location = await Location.findOne({ _id: player.location_id }, { projection: { location: 1 } });

		const data = {
			player,
			user,
			game,
			team,
			location,
		};

		return res.send({
			status: "success",
			data,
		});
	} catch (error) {
		return res.send(error);
	}
};
