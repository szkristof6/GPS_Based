const Game = require("../../collections/game");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { status } = req.params;

		const games = await Game.find().toArray();

		return res.send({
			status: "success",
			games: games.map((game) => ({ name: game.name, date: game.date, id: game.id, status: game.status })),
		});
	} catch (error) {
		return res.send(error);
	}
};
