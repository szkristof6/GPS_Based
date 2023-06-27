require("dotenv").config();

const captchaMiddleware = require("./methods/captcha");
const { jwtMiddleware } = require("./methods/jwt");

const { fastify, fastify_server } = require("./fastify");

fastify.decorate("verify", jwtMiddleware);
fastify.decorate("captcha", captchaMiddleware);

fastify.get("/", (req, res) => res.send({ status: "disallowed" }));

fastify.get("/page/verify", { preHandler: [fastify.verify] }, (req, res) => {
  if (!req.verified) return res.send({ status: "disallowed" });
  const next = req.user.permission > 5 ? "admin" : "join";

  return res.send({ status: "allowed", next });
});

/*
fastify.get("/page/socket/verify", (req, res) => {
  try {
    const token = req.unsignCookie(req.cookies.token);

    if (!token.valid) res.send({ status: "disallowed" });

    const decodedToken = fastify.jwt.verify(token.value);

    if (decodedToken) return res.send({ status: "allowed" });
  } catch (error) {
    res.send({ status: "disallowed" });
  }
});
*/

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

const createGame = require("./methods/game/createGame");

const joinGame = require("./methods/game/joinGame");
const updateLocation = require("./methods/game/updateLocation");
const getGame = require("./methods/game/getGame");
const getGame2 = require("./methods/game/getGame2");
const getGames = require("./methods/game/getGames");
const getStatus = require("./methods/game/getStatus");
const getPlayers = require("./methods/game/getPlayers");

const joinTeam = require("./methods/game/joinTeam");
const listTeam = require("./methods/game/listTeam");

const changeGameStatus = require("./methods/game/changeGameStatus");

fastify.post("/game/create", { preHandler: [fastify.verify, fastify.captcha] }, createGame); // Játék létrehozása 1

fastify.post("/game/join", { preHandler: [fastify.verify, fastify.captcha] }, joinGame); // Csatlakozás a játékba
fastify.post("/game/update/location", { preHandler: [fastify.verify] }, updateLocation); // Pozició frissítés
fastify.get("/game/data", { preHandler: [fastify.verify] }, getGame); // Játék adatok lekérdezése
fastify.get("/game/list/admin", { preHandler: [fastify.verify] }, getGames); // Adminként kezelt játékok lekérdezése
fastify.get("/game/data/admin/:id", { preHandler: [fastify.verify] }, getGame2); // Adminként kezelt játékok lekérdezése
fastify.get("/game/status", { preHandler: [fastify.verify] }, getStatus); // Játék státus lekérdezés
fastify.get("/game/players", { preHandler: [fastify.verify] }, getPlayers); // Játékosok lekérdezése

fastify.post("/game/team/join", { preHandler: [fastify.verify] }, joinTeam); // Csatlakozás a játékba
fastify.get("/game/team/list", { preHandler: [fastify.verify] }, listTeam); // Csatlakozás a játékba

fastify.get("/game/status/waiting", { preHandler: [fastify.verify] }, changeGameStatus); // Játék státus: waiting
fastify.get("/game/status/start", { preHandler: [fastify.verify] }, changeGameStatus); // Játék státus: start
fastify.get("/game/status/stop", { preHandler: [fastify.verify] }, changeGameStatus); // Játék státus: stop
fastify.get("/game/status/pause", { preHandler: [fastify.verify] }, changeGameStatus); // Játék státus: pause
fastify.get("/game/status/resume", { preHandler: [fastify.verify] }, changeGameStatus); // Játék státus: resume

// File methods -

const pictureUpload = require("./methods/upload/picture");
const servePicture = require("./methods/upload/servePicture");

fastify.post("/upload/picture", { preHandler: [fastify.verify] }, pictureUpload);

fastify.get("/cdn/p/:hash", { preHandler: [fastify.verify] }, servePicture);

// Chat methods -

const sendMessage = require("./methods/chat/sendMessage");
const listMessages = require("./methods/chat/listMessages");

fastify.post("/message/send", { preHandler: [fastify.verify] }, sendMessage); // Üzenet küldése
fastify.get("/message/list", { preHandler: [fastify.verify] }, listMessages); // Üzenetek lekérése

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

const addPlayer = require("./methods/player/addPlayer");
const getPlayerData = require("./methods/player/getPlayerData");

fastify.post("/player/add", { preHandler: [fastify.verify] }, addPlayer); // Játékos hozzásadáse
fastify.get("/player/data", { preHandler: [fastify.verify] }, getPlayerData); // Játékos adatok lekérdezése

// Moderator methods

const addModerator = require("./methods/moderator/addModerator");
const deleteModerator = require("./methods/moderator/deleteModerator");

fastify.post("/moderator/add", { preHandler: [fastify.verify, fastify.captcha] }, addModerator); // Moderátor hozzásadáse
fastify.delete("/moderator/delete", { preHandler: [fastify.verify, fastify.captcha] }, deleteModerator); // Moderátor törlése

fastify.ready(() => {
  /*
  fastify.io.use(async function (socket, next) {
    console.log(socket.handshake.query);
    if (socket.handshake.query && socket.handshake.query.token) {
      const cookies = Object.entries({
        token: socket.handshake.query.token,
      })
        .map((param) => param.join("="))
        .join("; ");

      const response = await fetch("http://localhost:1337/page/socket/verify", {
        headers: {
          Cookie: cookies,
        },
      }).then((data) => data.json());

      if (response.status === "allowed") next();
      else {
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  });
  fastify.io.on("connection", (socket) => {
    socket.on("test", async (param, send) => send(param));
  });
*/

  fastify_server.listen({ port: process.env.PORT }, (error) => {
    console.log(`Fastify server started at port: ${process.env.PORT}`);
  });
});
