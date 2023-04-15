const { fastify, fastify_server } = require("./fastify");
const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const captchaMiddleware = require("./methods/captcha");
const { jwtMiddleware } = require("./methods/jwt");

fastify.decorate("verify", jwtMiddleware);
fastify.decorate("captcha", captchaMiddleware);

fastify.get("/verifyPage", { preHandler: [fastify.verify] }, (req, res) => {
  if (!req.verified) return res.send({ status: "disallowed" });
  return res.send({ status: "allowed" });
});

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

fastify.post("/facebookLogin", { preHandler: [fastify.captcha] }, require("./methods/user/facebookLogin")); // Felhasználó belépés
fastify.post("/googleLogin", { preHandler: [fastify.captcha] }, require("./methods/user/googleLogin")); // Felhasználó belépés
fastify.post("/loginUser", { preHandler: [fastify.captcha] }, require("./methods/user/loginUser")); // Felhasználó belépés
fastify.post("/registerUser", { preHandler: [fastify.captcha] }, require("./methods/user/registerUser")); // Felhasználó regisztrálása
fastify.post(
  "/requestResetPassword",
  { preHandler: [fastify.captcha] },
  require("./methods/user/requestResetPassword")
); // Jelszóemlékeztető kérése
fastify.post("/resetPassword", { preHandler: [fastify.captcha] }, require("./methods/user/resetPassword")); // Jelszó visszaállítása
fastify.post("/verifyUser", { preHandler: [fastify.captcha] }, require("./methods/user/verifyUser")); // Felhasználói fiók megerősítése
fastify.get("/logoutUser", { preHandler: [fastify.verify] }, require("./methods/user/logoutUser")); // Felhasználó belépés

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

fastify.post("/createGame", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/createGame")); // Játék létrehozása
fastify.post("/joinGame", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/joinGame")); // Csatlakozás a játékba
fastify.post("/updateLocation", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/game/updateLocation")); // Csatlakozás a játékba
fastify.get("/getGame", { preHandler: [fastify.verify] }, require("./methods/game/getGame")); // Játék azonosító lekérdezése
fastify.get("/getStatus", { preHandler: [fastify.verify] }, require("./methods/game/getStatus")); // Játék azonosító lekérdezése

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

fastify.post("/addPlayer", { preHandler: [fastify.verify] }, require("./methods/player/addPlayer")); // Játékos hozzásadáse
fastify.get("/getPlayerData", { preHandler: [fastify.verify] }, require("./methods/player/getPlayerData")); // Játék azonosító lekérdezése
fastify.get("/getPlayers", { preHandler: [fastify.verify] }, require("./methods/player/getPlayers")); // Játék azonosító lekérdezése

// Team methods

fastify.post("/addTeam", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/team/addTeam")); // Csapat hozzásadáse
fastify.delete("/deleteTeam", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/team/deleteTeam")); // Csapat adatainak lekérdezése

// Obejct methods

fastify.post("/addObejct", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/object/addObject")); // Csapat hozzásadáse
fastify.delete("/deleteObejct", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/team/deleteTeam")); // Csapat adatainak lekérdezése

// Moderator methods

fastify.post("/addModerator", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/moderator/addModerator")); // Csapat hozzásadáse
fastify.delete("/deleteModerator", { preHandler: [fastify.verify, fastify.captcha] }, require("./methods/moderator/deleteModerator")); // Csapat adatainak lekérdezése

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
