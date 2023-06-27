require("dotenv").config();

const JWT = require("../../collections/jwt");

const { clearCookie } = require("../cookie");

function removeCookies(req, res) {
	const cookies = Object.keys(req.cookies);
	cookies.forEach((cookie) => (res = clearCookie(cookie, res)));

	return res;
}

module.exports = async function (req, res) {
	try {
		if (!req.verified) {
			res = removeCookies(req, res);
			return res.code(400).send({ status: "error", message: "Not allowed!" });
		}

		const exist = await JWT.countDocuments({ user_id: req.user.user_id }).then((num) => num === 1);
		if (!exist) {
			return res.code(400).send({ status: "error", message: "Not logged in!" });
		} else {
			await JWT.deleteOne({ user_id: req.user.user_id });
		}

		res = removeCookies(req, res);

		return res.send({ status: "success" });
	} catch (error) {
		return res.send(error);
	}
};
