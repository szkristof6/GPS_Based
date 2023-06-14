const Messages = require("../../collections/message");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id || !req.query.p_id || !req.query.t_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id, p_id: player_id, t_id: team } = req.query;

		const messages = await Messages.find({ game_id });
		if (!messages) return res.code(400).send({ status: "error", message: "This game does not have any messages!" });

		const filterdMessages = messages
			.filter(
				(message) =>
					message.receiver_type === "global" || (message.receiver_type === "team" && message.receiver_id === team_id) || (message.receiver_type === "player" && message.receiver_id === player_id)
			)
			.map((element) => ({
				text: element.message,
				type: element.receiver_type,
				sender: element.sender_id,
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
