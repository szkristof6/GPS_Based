const mongoose = require("mongoose");

const Messages = require("../../collections/message");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    const playerID = req.unsignCookie(req.cookies.p_id);
    //const teamID = req.unsignCookie(req.cookies.t_id);
    if (!gameID.valid && !playerID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const messages = await Messages.find({ game_id: gameID.value });
    if (!messages) return res.code(400).send({ status: "error", message: "This game does not have any messages!" });

    const filterdMessages = messages
      .filter(
        (message) =>
          message.receiver_type === "global" ||
          (message.receiver_type === "team" && message.receiver_id === new mongoose.Types.ObjectId(teamID.value)) ||
          (message.receiver_type === "player" && message.receiver_id === new mongoose.Types.ObjectId(playerID.value))
      )
      .map((element) => ({
        text: element.message,
        type: element.receiver_type,
        sender: element.sender_id.toString(),
        time: element.createdAt,
      }));

    return res.send({
      count: filterdMessages.length,
      messages: filterdMessages,
    });
  } catch (error) {
    return res.send(error);
  }
};
