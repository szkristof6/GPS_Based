const Player = require("../../collections/player");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const players = await Player.find({ game_id });
		if (!players) return res.code(400).send({ status: "error", message: "This game does not have any players!" });

		return res.send({
			count: players.length,
			players,
		});
	} catch (error) {
		return res.send(error);
	}
};
