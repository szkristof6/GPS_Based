const fastify = require("./fastify");

require("dotenv").config();

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

const facebookLogin = require("./methods/user/facebookLogin");
const googleLogin = require("./methods/user/googleLogin");

const registerUser = require("./methods/user/registerUser");
const loginUser = require("./methods/user/loginUser");
const listUsers = require("./methods/user/listUsers");

fastify.post("/facebookLogin", facebookLogin); // Felhasználó belépés
fastify.post("/googleLogin", googleLogin); // Felhasználó belépés

fastify.post("/registerUser", registerUser); // Felhasználó regisztrálása
fastify.post("/loginUser", loginUser); // Felhasználó belépés
fastify.get("/listUsers", { onRequest: [fastify.verify] }, listUsers); // Felhasználók megjelenítése

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

const createGame = require("./methods/game/createGame"); // Játék létrehozása
const getGame = require("./methods/game/getGame"); // Játék adatok lekérdezése
const getGameID = require("./methods/game/getGameID"); // Játék azonosító lekérdezése
const listGames = require("./methods/game/listGames"); // Játékok lekérdezése

fastify.post("/createGame", { onRequest: [fastify.verify] }, createGame);
fastify.post("/getGame", { onRequest: [fastify.verify] }, getGame);
fastify.post("/getGameID", getGameID);
fastify.get("/listGames", { onRequest: [fastify.verify] }, listGames);

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

const addPlayer = require("./methods/player/addPlayer"); // Játékos hozzásadáse
const updateLocation = require("./methods/player/updateLocation"); // Játékos pozició frissítés
const getPlayerData = require("./methods/player/getPlayerData"); // Játékos adatainak lekérdezése
const listPlayers = require("./methods/player/listPlayers"); // Adott játékban lévő játékosok lekérdezése

fastify.post("/addPlayer", { onRequest: [fastify.verify] }, addPlayer);
fastify.post("/updateLocation", { onRequest: [fastify.verify] }, updateLocation);
fastify.post("/listPlayers", { onRequest: [fastify.verify] }, listPlayers);
fastify.get("/getPlayerData", { onRequest: [fastify.verify] }, getPlayerData);

/*
Abban az esetben, hogyha semmilyen útba nem tartozik a kérés, akkor ide kerülünk.
Ezt használjuk hibakezelésnek
*/

// Megadjuk milyen porton fusson a szerver
const port = process.env.PORT || 1337;

// Létrehozzuk a szervert az adott porton
fastify.listen({ port }, (err) => {
  if (err) throw err;
});
