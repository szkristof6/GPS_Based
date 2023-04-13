const { fastify, fastify_server } = require("./fastify");
const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const captchaMiddleware = require("./methods/captcha");
const { jwtMiddleware } = require("./methods/jwt");

fastify.decorate("verify", jwtMiddleware);
fastify.decorate("captcha", captchaMiddleware);

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

fastify.post("/facebookLogin", { preHandler: [fastify.captcha] }, require("./methods/user/facebookLogin")); // Felhasználó belépés
fastify.post("/googleLogin", { preHandler: [fastify.captcha] }, require("./methods/user/googleLogin")); // Felhasználó belépés
fastify.post("/loginUser", { preHandler: [fastify.captcha] }, require("./methods/user/loginUser")); // Felhasználó belépés
fastify.post("/registerUser", { preHandler: [fastify.captcha] }, require("./methods/user/registerUser")); // Felhasználó regisztrálása
fastify.post("/requestResetPassword", { preHandler: [fastify.captcha] }, require("./methods/user/requestResetPassword")); // Jelszóemlékeztető kérése
fastify.post("/resetPassword", { preHandler: [fastify.captcha] }, require("./methods/user/resetPassword")); // Jelszó visszaállítása
fastify.post("/verifyUser", { preHandler: [fastify.captcha] }, require("./methods/user/verifyUser")); // Felhasználói fiók megerősítése

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

fastify.post("/createGame", { preHandler: [fastify.verify] }, require("./methods/game/createGame")); // Játék létrehozása
fastify.post("/joinGame", { preHandler: [fastify.verify] }, require("./methods/game/joinGame")); // Csatlakozás a játékba
fastify.get("/getGame", { preHandler: [fastify.verify] }, require("./methods/game/getGame")); // Játék azonosító lekérdezése

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

fastify.post("/addPlayer", { preHandler: [fastify.verify] }, require("./methods/player/addPlayer")); // Játékos hozzásadáse

// Team methods

fastify.post("/addTeam", { preHandler: [fastify.verify] }, require("./methods/team/addTeam")); // Csapat hozzásadáse
fastify.get("/getTeam", { preHandler: [fastify.verify] }, require("./methods/team/getTeam")); // Csapat adatainak lekérdezése

fastify.get("/test", { preHandler: [fastify.captcha, fastify.verify] }, (request, response) => {
  return response.send({ captcha: request.captchaVerify, verified: request.verified, user: request.user });
});

// Socket methods

fastify.ready(() => {
  fastify.io.on("connection", (socket) => {
    socket.on("getStatus", (game_id, send) =>
      require("./methods/game/getStatus")(game_id).then((response) => send(response))
    ); // Játék státusztának lekérdezése
    socket.on("getPlayerData", (player_id, send) =>
      require("./methods/player/getPlayerData")(player_id).then((response) => send(response))
    ); // Játékos adatainak lekérdezése
    socket.on("listPlayers", (player_id, send) =>
      require("./methods/player/listPlayers")(player_id).then((response) => send(response))
    ); // Adott játékban lévő játékosok lekérdezése
    socket.on("updateLocation", (object, send) =>
      require("./methods/game/updateLocation")(object).then((response) => send(response))
    ); // Játékos pozició frissítés
  });

  fastify_server.listen({ port: process.env.PORT }, (error) => {
    console.log(`Fastify server started at port: ${process.env.PORT}`);
  });
});
