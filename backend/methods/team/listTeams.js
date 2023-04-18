const Team = require("../../collections/team");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const teams = await Team.find({ game_id: gameID.value });
    if (!teams) return res.code(400).send({ status: "error", message: "This game does not have any teams!" });

    return res.send({
      count: teams.length,
      teams: teams.map((team) => ({ id: team._id.toString(), name: team.name })),
    });
  } catch (error) {
    return res.send(error);
  }
};
