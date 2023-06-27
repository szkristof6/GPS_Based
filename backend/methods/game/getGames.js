const Game = require("../../collections/game");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const game = await Game.find({}, { projection: { name: 1, id: 1, _id: 0 } }).toArray();

		return res.send({
			status: "success",
			game,
		});
	} catch (error) {
		return res.send(error);
	}
};
