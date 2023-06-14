const Team = require("../../collections/team");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

    const teams = await Team.find({ game_id }, { projection: { image: 1, _id: 1 } });

    return res.send({
      status: "success",
      teams,
    });
  } catch (error) {
    return res.send(error);
  }
};
