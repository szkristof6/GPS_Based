const jwt = require('jsonwebtoken');

require("dotenv").config();

const JWT = require("./collections/jwt")

module.exports = async function (request, reply, next) {
	try {
		let token;
		if (request.query.access_token) token = request.query.access_token;
		else {
			request.verified = false;

			next();
		}

		const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

		if (decodedToken) {
			const existing = await JWT.countDocuments({ user_id: decodedToken.user_id }).then((num) => num === 1);

			if (!existing) request.verified = false;
			else {
				request.verified = true;
				request.user = decodedToken;
			}

			next();
		}
	} catch (error) {
		request.verified = false;

		next();
	}
};
