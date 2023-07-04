const escapeHtml = require("escape-html");
const { ObjectId } = require("mongodb");

const Player = require("../../collections/player");

const states = ["dead", "alive"];

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed! 1" });
		if (!req.query.p_id) return res.code(400).send({ status: "error", message: "Not allowed! 2"  });

		const change = escapeHtml(req.params.status);
		if (!change) return res.code(400).send({ status: "error", message: "Not allowed! 4" });

		if (!states.includes(change)) return res.code(400).send({ status: "error", message: "Not allowed! 3" });

		const { p_id: player_id } = req.query;

		await Player.updateOne({ _id: new ObjectId(player_id) }, { $set: { status: change }, $inc: { deaths: 1 } });

		return res.send({ status: "success", newStatus: change });
	} catch (error) {
		return res.send(error);
	}
};
