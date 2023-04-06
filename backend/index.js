const { fastify, fastify_server } = require("./fastify");

require("dotenv").config();

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

const facebookLogin = require("./methods/user/facebookLogin");
const googleLogin = require("./methods/user/googleLogin");
const registerUser = require("./methods/user/registerUser");
const loginUser = require("./methods/user/loginUser");
const requestResetPassword = require("./methods/user/requestResetPassword");
const resetPassword = require("./methods/user/resetPassword");
const verifyUser = require("./methods/user/verifyUser");

fastify.post("/facebookLogin", facebookLogin); // Felhasználó belépés
fastify.post("/googleLogin", googleLogin); // Felhasználó belépés
fastify.post("/loginUser", loginUser); // Felhasználó belépés
fastify.post("/registerUser", registerUser); // Felhasználó regisztrálása
fastify.post("/requestResetPassword", requestResetPassword); // Jelszóemlékeztető kérése
fastify.post("/resetPassword", resetPassword); // Jelszó visszaállítása
fastify.post("/verifyUser", verifyUser); // Felhasználói fiók megerősítése

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

const createGame = require("./methods/game/createGame"); // Játék létrehozása
const joinGame = require("./methods/game/joinGame"); // Játék azonosító lekérdezése
const getStatus = require("./methods/game/getStatus"); // Játék státusztának lekérdezése
const getGame = require("./methods/game/getGame"); // Játék státusztának lekérdezése
const updateLocation = require("./methods/game/updateLocation"); // Játékos pozició frissítés

fastify.post("/createGame", { onRequest: [fastify.verify] }, createGame);
fastify.post("/joinGame", { onRequest: [fastify.verify] }, joinGame);
fastify.get("/getGame", { onRequest: [fastify.verify] }, getGame);

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

const addPlayer = require("./methods/player/addPlayer"); // Játékos hozzásadáse
const getPlayerData = require("./methods/player/getPlayerData"); // Játékos adatainak lekérdezése
const listPlayers = require("./methods/player/listPlayers"); // Adott játékban lévő játékosok lekérdezése

fastify.post("/addPlayer", { onRequest: [fastify.verify] }, addPlayer);

const addTeam = require("./methods/team/addTeam"); // Csapat hozzásadáse
const getTeam = require("./methods/team/getTeam"); // Csapat adatainak lekérdezése

fastify.post("/addTeam", { onRequest: [fastify.verify] }, addTeam);
fastify.get("/getTeam", { onRequest: [fastify.verify] }, getTeam);

/*
Abban az esetben, hogyha semmilyen útba nem tartozik a kérés, akkor ide kerülünk.
Ezt használjuk hibakezelésnek
*/

// Megadjuk milyen porton fusson a szerver
// Létrehozzuk a szervert az adott porton

fastify.ready(() => {
  fastify.io.on("connection", (socket) => {
    socket.on("getStatus", (game_id, send) => getStatus(game_id).then((response) => send(response)));
    socket.on("getPlayerData", (player_id, send) => getPlayerData(player_id).then((response) => send(response)));
    socket.on("listPlayers", (player_id, send) => listPlayers(player_id).then((response) => send(response)));
    socket.on("updateLocation", (object, send) => updateLocation(object).then((response) => send(response)));
  });

  fastify_server.listen({ port: process.env.PORT }, (error) => {
    console.log(`Fastify server started at port: ${process.env.PORT}`);
  });
});
