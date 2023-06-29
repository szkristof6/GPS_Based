const Team = require("../../collections/team");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const teams = await Team.find({ game_id }).toArray();
		teams.shift();

		return res.send({
			status: "success",
			teams: teams.map((team) => ({ id: team._id, image: team.image })),
		});
	} catch (error) {
		return res.send(error);
	}
};
