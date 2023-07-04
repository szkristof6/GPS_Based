const { ObjectId } = require("mongodb");

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

		const player = await Player.findOne({ _id: new ObjectId(player_id) });
		const user = await User.findOne({ _id: new ObjectId(player.user_id) });
		const game = await Game.findOne({ _id: new ObjectId(player.game_id) });
		const team = await Team.findOne({ _id: new ObjectId(player.team_id) });

		return res.send({
			status: "success",
			data: {
				player: {
					point: player.point,
					status: player.status,
					deaths: player.deaths,
				},
				user: {
					image: user.image,
					name: user.name,
					permission: user.permission,
				},
				game: {
					name: game.name,
				},
				team: {
					image: team.image,
					point: team.point,
				},
			},
		});
	} catch (error) {
		return res.send(error);
	}
};
