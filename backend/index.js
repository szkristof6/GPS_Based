const { fastify, fastify_server } = require("./fastify");
const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const captchaMiddleware = require("./methods/captcha");
const { jwtMiddleware } = require("./methods/jwt");

fastify.decorate("verify", jwtMiddleware);
fastify.decorate("captcha", captchaMiddleware);

fastify.get("/", (req, res) => res.send({ status: "disallowed" }));

fastify.get("/page/verify", { preHandler: [fastify.verify] }, (req, res) => {
  if (!req.verified) return res.send({ status: "disallowed" });
  return res.send({ status: "allowed" });
});

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

fastify.post("/login/facebook", { preHandler: [fastify.captcha] }, require("./methods/user/facebookLogin")); // Felhasználó belépés
fastify.post("/login/google", { preHandler: [fastify.captcha] }, require("./methods/user/googleLogin")); // Felhasználó belépés
fastify.post("/login/user", { preHandler: [fastify.captcha] }, require("./methods/user/loginUser")); // Felhasználó belépés
fastify.post("/register", { preHandler: [fastify.captcha] }, require("./methods/user/registerUser")); // Felhasználó regisztrálása
fastify.post(
  "/user/reset/password/request",
  { preHandler: [fastify.captcha] },
  require("./methods/user/requestResetPassword")
);
fastify.post("/user/reset/password", { preHandler: [fastify.captcha] }, require("./methods/user/resetPassword")); // Jelszó visszaállítása
fastify.post("/user/verify", { preHandler: [fastify.captcha] }, require("./methods/user/verifyUser")); // Felhasználói fiók megerősítése
fastify.get("/user/logout", { preHandler: [fastify.verify] }, require("./methods/user/logoutUser")); // Felhasználó belépés

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

fastify.post("/game/create/general", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/create/general")); // Játék létrehozása
fastify.post("/game/create/gamemode", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/create/gamemode")); // Játék létrehozása

fastify.post("/game/join", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/joinGame")); // Csatlakozás a játékba
fastify.post("/game/update/location", { preHandler: [fastify.verify] }, require("./methods/game/updateLocation"));
fastify.get("/game/data", { preHandler: [fastify.verify] }, require("./methods/game/getGame")); // Játék azonosító lekérdezése
fastify.get("/game/status", { preHandler: [fastify.verify] }, require("./methods/game/getStatus")); // Játék azonosító lekérdezése
fastify.get("/game/players", { preHandler: [fastify.verify] }, require("./methods/game/getPlayers")); // Játék azonosító lekérdezése

const changeGameStatus = require("./methods/game/changeGameStatus");

fastify.get("/game/status/waiting", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék azonosító lekérdezése
fastify.get("/game/status/start", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék azonosító lekérdezése
fastify.get("/game/status/stop", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék azonosító lekérdezése
fastify.get("/game/status/pause", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék azonosító lekérdezése
fastify.get("/game/status/resume", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék azonosító lekérdezése

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

fastify.post("/player/add", { preHandler: [fastify.verify] }, require("./methods/player/addPlayer")); // Játékos hozzásadáse
fastify.get("/player/data", { preHandler: [fastify.verify] }, require("./methods/player/getPlayerData")); // Játék azonosító lekérdezése

// Team methods

fastify.post("/team/add", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/team/addTeam")); // Csapat hozzásadáse
fastify.delete("/team/delete", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/team/deleteTeam")); // Csapat adatainak lekérdezése

// Obejct methods

fastify.post("/object/add", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/object/addObject")); // Csapat hozzásadáse
fastify.delete(
  "/object/delete",
  { preHandler: [fastify.verify, fastify.captcha] },
  require("./methods/team/deleteTeam")
); // Csapat adatainak lekérdezése

// Moderator methods

fastify.post(
  "/moderator/add",
  { preHandler: [fastify.verify, fastify.captcha] },
  require("./methods/moderator/addModerator")
); // Csapat hozzásadáse
fastify.delete(
  "/moderator/delete",
  { preHandler: [fastify.verify, fastify.captcha] },
  require("./methods/moderator/deleteModerator")
); // Csapat adatainak lekérdezése

// Socket methods

fastify.ready(() => {
  /*
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
*/

  fastify_server.listen({ port: process.env.PORT }, (error) => {
    console.log(`Fastify server started at port: ${process.env.PORT}`);
  });
});
