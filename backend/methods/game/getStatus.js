const { ObjectId } = require("mongodb");

const Game = require("../../collections/game");
const Player = require("../../collections/player");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const count = await Player.countDocuments({ game_id });
		const game = await Game.findOne({ _id: new ObjectId(game_id) });
		if (!game) return { status: "error", message: "An error has occured!" };

		return res.send({
			status: "success",
			game: {
				count,
				time: game.date,
				status: game.status,
			},
		});
	} catch (error) {
		return res.send(error);
	}
};
