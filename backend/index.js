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

const facebookLogin = require("./methods/user/facebookLogin");
const googleLogin = require("./methods/user/googleLogin");
const loginUser = require("./methods/user/loginUser");
const registerUser = require("./methods/user/registerUser");
const requestResetPassword = require("./methods/user/requestResetPassword");
const resetPassword = require("./methods/user/resetPassword");
const verifyUser = require("./methods/user/verifyUser");
const logoutUser = require("./methods/user/logoutUser");

fastify.post("/login/facebook", { preHandler: [fastify.captcha] }, facebookLogin); // Facebook belépés
fastify.post("/login/google", { preHandler: [fastify.captcha] }, googleLogin); // Google belépés
fastify.post("/login/user", { preHandler: [fastify.captcha] }, loginUser); // Email belépés
fastify.post("/register", { preHandler: [fastify.captcha] }, registerUser); // Regisztráció
fastify.post("/user/reset/password/request", { preHandler: [fastify.captcha] }, requestResetPassword); // Visszaállítás kérés
fastify.post("/user/reset/password", { preHandler: [fastify.captcha] }, resetPassword); // Jelszó visszaállítása
fastify.post("/user/verify", { preHandler: [fastify.captcha] }, verifyUser); // Felhasználói fiók megerősítése
fastify.get("/user/logout", { preHandler: [fastify.verify] }, logoutUser); // Kilépés

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

const general = require("./methods/game/create/general");
const gamemode = require("./methods/game/create/gamemode");

const joinGame = require("./methods/game/joinGame");
const updateLocation = require("./methods/game/updateLocation");
const getGame = require("./methods/game/getGame");
const getStatus = require("./methods/game/getStatus");
const getPlayers = require("./methods/game/getPlayers");

const changeGameStatus = require("./methods/game/changeGameStatus");

fastify.post("/game/create/general", { preHandler: [fastify.verify, fastify.captcha] }, general); // Játék létrehozása 1
fastify.post("/game/create/gamemode", { preHandler: [fastify.verify, fastify.captcha] }, gamemode); // Játék létrehozása 2

fastify.post("/game/join", { preHandler: [fastify.verify, fastify.captcha] }, joinGame); // Csatlakozás a játékba
fastify.post("/game/update/location", { preHandler: [fastify.verify] }, updateLocation); // Pozició frissítés
fastify.get("/game/data", { preHandler: [fastify.verify] }, getGame); // Játék adatok lekérdezése
fastify.get("/game/status", { preHandler: [fastify.verify] }, getStatus); // Játék státus lekérdezés
fastify.get("/game/players", { preHandler: [fastify.verify] }, getPlayers); // Játékosok lekérdezése

fastify.get("/game/status/waiting", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék státus: waiting
fastify.get("/game/status/start", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék státus: start
fastify.get("/game/status/stop", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék státus: stop
fastify.get("/game/status/pause", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék státus: pause
fastify.get("/game/status/resume", { preHandler: [fastify.verify, fastify.captcha] }, changeGameStatus); // Játék státus: resume

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

const addPlayer = require("./methods/player/addPlayer");
const getPlayerData = require("./methods/player/getPlayerData");

fastify.post("/player/add", { preHandler: [fastify.verify] }, addPlayer); // Játékos hozzásadáse
fastify.get("/player/data", { preHandler: [fastify.verify] }, getPlayerData); // Játékos adatok lekérdezése

// Team methods

const addTeam = require("./methods/team/addTeam");
const deleteTeam = require("./methods/team/deleteTeam");

fastify.post("/team/add", { preHandler: [fastify.verify, fastify.captcha] }, addTeam); // Csapat hozzásadáse
fastify.delete("/team/delete", { preHandler: [fastify.verify, fastify.captcha] }, deleteTeam); // Csapat törlése

// Obejct methods

const addObject = require("./methods/object/addObject");
const deleteObject = require("./methods/object/deleteObject");

fastify.post("/object/add", { preHandler: [fastify.verify, fastify.captcha] }, addObject); // Objektum hozzásadáse
fastify.delete("/object/delete", { preHandler: [fastify.verify, fastify.captcha] }, deleteObject); // Objektum törlése

// Moderator methods

const addModerator = require("./methods/moderator/addModerator");
const deleteModerator = require("./methods/moderator/deleteModerator");

fastify.post("/moderator/add", { preHandler: [fastify.verify, fastify.captcha] }, addModerator); // Moderátor hozzásadáse
fastify.delete("/moderator/delete", { preHandler: [fastify.verify, fastify.captcha] }, deleteModerator); // Moderátor törlése

fastify.ready(() => {
  fastify_server.listen({ port: process.env.PORT }, (error) => {
    console.log(`Fastify server started at port: ${process.env.PORT}`);
  });
});
