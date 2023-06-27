require("dotenv").config();

const JWT = require("../collections/jwt");

const { fastify } = require("../fastify");

const tokenTime = "30d";

function JWT_sign(user, expiresIn) {
	return fastify.jwt.sign({ user_id: user._id, permission: user.permission }, { expiresIn });
}

async function jwtMiddleware(request, reply) {
	try {
		let token;
		if (request.query.access_token) token = request.query.access_token;
		else {
			request.verified = false;
			return;
		}
		
		const decodedToken = fastify.jwt.verify(token);
		
		if (decodedToken) {
			const existing = await JWT.countDocuments({ user_id: decodedToken.user_id }).then((num) => num === 1);

			if (!existing) request.verified = false;
			else {
				request.verified = true;
				request.user = decodedToken;
			}

			return;
		}
	} catch (error) {
		request.verified = false;
	}
}

/*
async function getNewToken(request, reply) {
  try {
    const refreshToken = request.unsignCookie(request.cookies.refreshToken);
    if (!refreshToken.valid) request.verified = false;

    const decodedToken = fastify.jwt.verify(refreshToken.value);

    if (decodedToken) {
      const existing = await JwtRefresh.findOne({ user_id: decodedToken.user_id });

      if (!existing) request.verified = false;
      else {
        const token = fastify.jwt.sign(
          { user_id: decodedToken.user_id, permission: decodedToken.permission },
          { expiresIn: tokenTime }
        );
        const refresh = fastify.jwt.sign(
          { user_id: decodedToken.user_id, permission: decodedToken.permission },
          { expiresIn: refreshTime }
        );

        await JwtRefresh.updateOne({ user_id: decodedToken.user_id }, { $set: { token: refresh } });

        reply = setCookie("token", token, reply);
        reply = setCookie("refreshToken", refresh, reply);

        request.verified = true;
        request.body = decodedToken;
      }
    }
  } catch (error) {
    request.verified = false;
  }
}

*/

async function setJWTCookie(user, res) {
	try {
		const token = JWT_sign(user, tokenTime);

		// const refresh = JWT_sign(user, refreshTime);

		const existing = await JWT.countDocuments({ user_id: user._id }).then((num) => num === 1);
		if (existing) await JWT.updateOne({ user_id: user._id }, { $set: { token } });
		else {
			const newJWT = {
				user_id: user._id.toString(),
				token,
				createdAt: new Date(),
			};

			await JWT.insertOne(newJWT);
		}

		// res = setCookie("token", token, res);
		//res = setCookie("refreshToken", refresh, res);

		return token;
	} catch (error) {
		return res.send(error);
	}
}

module.exports = { JWT_sign, jwtMiddleware, setJWTCookie };
