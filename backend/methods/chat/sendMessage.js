const yup = require("yup");
const escapeHtml = require("escape-html");

require("dotenv").config();

const Message = require("../../collections/message");

const { trimmedString } = require("../../schema");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const schema = yup.object().shape({
			message: trimmedString.max(255),
			receiver_type: trimmedString,
			receiver: trimmedString,
		});

		await schema.validate(req.body);

		const { g_id: game_id } = req.query;

		const newMessage = {
			message: escapeHtml(req.body.message),
			receiver_type: escapeHtml(req.body.receiver_type),
			game_id,
			sender_id: req.user.user_id,
			receiver_id: req.body.receiver_id,
		};

		await Message.insertOne(newMessage);

		return res.send({ status: "success" });
	} catch (error) {
		return res.send(error);
	}
};
