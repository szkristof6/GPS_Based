const Player = require("../../collections/player");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const players = await Player.find({ game_id: gameID.value });
    if (!players) return res.code(400).send({ status: "error", message: "This game does not have any players!" });

    return res.send({
      count: players.length,
      teams: players.map((player) => ({ id: player._id.toString(), name: player.name })),
    });
  } catch (error) {
    return res.send(error);
  }
};
