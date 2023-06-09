require("dotenv").config();

const JwtRefresh = require("../collections/jwt_refresh");

const { fastify } = require("../fastify");
const { setCookie } = require("./cookie");

const tokenTime = "10m";
const refreshTime = "30d";

function JWT_sign(user, expiresIn) {
  return fastify.jwt.sign({ user_id: user._id, permission: user.permission }, { expiresIn });
}

async function jwtMiddleware(request, reply) {
  try {
    const token = request.unsignCookie(request.cookies.token);

    if (!token.valid) request.verified = false;

    const decodedToken = fastify.jwt.verify(token.value);

    if (decodedToken) {
      request.verified = true;
      request.user = decodedToken;
    }
  } catch (error) {
    if (error.code === "FAST_JWT_EXPIRED") await getNewToken(request, reply);
    else {
      request.verified = false;
    }
  }
}

async function getNewToken(request, reply) {
  try {
    const refreshToken = request.unsignCookie(request.cookies.refreshToken);
    if (!refreshToken.valid) request.verified = false;

    const decodedToken = fastify.jwt.verify(refreshToken.value);

    if (decodedToken) {
      const existing = await JwtRefresh.findOne({ user_id: decodedToken.user_id });

      if (!existing) request.verified = false;
      else {
        const token = fastify.jwt.sign({ user_id: decodedToken.user_id }, { expiresIn: tokenTime });
        const refresh = fastify.jwt.sign({ user_id: decodedToken.user_id }, { expiresIn: refreshTime });

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

async function setJWTCookie(user, res) {
  try {
    const token = JWT_sign(user, tokenTime);
    const refresh = JWT_sign(user, refreshTime);

    const existing = await JwtRefresh.findOne({ user_id: user._id });
    if (existing) await JwtRefresh.updateOne({ user_id: user._id }, { $set: { token: refresh } });
    else {
      const refreshToken = new JwtRefresh({
        user_id: user._id,
        token: refresh,
      });

      await refreshToken.save();
    }

    res = setCookie("token", token, res);
    res = setCookie("refreshToken", refresh, res);

    return true;
  } catch (error) {
    return res.send(error);
  }
}

module.exports = { JWT_sign, jwtMiddleware, setJWTCookie };
