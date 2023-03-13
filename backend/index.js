const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

/* .env
Itt élenek a globális változók
úgy érjük el, hogy process.env.<változó neve>
*/
require("dotenv").config();

/*
A backend express.js-t használ az API megvalósítására.

Előszőr pár 3rd party middleware-t behozunk, amik különféle funkciókat hoznak be nekük:
  Helmet - mindenféle headert állít be, ami segít biztonságosabbá tenni a backendet
  Morgan - log miatt, lássuk az API műveleteti
  Cors - ez egy új funkciói az új böngészőknek, azért van, hogy korlátozza a backend elérhetőségéet.
    Úgy csinálja, hogy megmondja milyen címek érhetik el a backendet és milyen módon (POST, GET, ...)
    Ha jelen van ez a header, akkor a kliens egy OPTION requestet küld először, hogy kommunikájon a backendel
    Ha ez az OPTION sikeresen vissztér a megfelelő CORS headerekkel, amik egyeznek a cliensen, akkor küldi a további kérést
  Definiáljuk, hogy JSON adatokkal fogunk dolgozni
*/

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

/*
JWT tokent használunk azonosításra.
Ez azért jó, mert nem a szerveren tartjuk számon a felhasználót, mint egy session alapu azonosításban, 
Hanem a kliensen tároljuk ezt a tokent, hogyha bármi történne a kapcsolattal, ne veszítsük el a felhasználóval a kapcsolatot

Hogyha egy adott útban szerepel a verify cimke, akkor az azt jelenti, hogy egy védett út,
szóval csak egy érvényes tokennel rendelkező felhasználó tudja elérni az adott utat
*/

const verify = require("./methods/verifyJWT");

// User methods - Minden olyan funkció, ami a felhasználóhoz tartozik

const registerUser = require("./methods/user/registerUser");
const loginUser = require("./methods/user/loginUser");
const listUsers = require("./methods/user/listUsers");

app.post("/registerUser", registerUser); // Felhasználó regisztrálása
app.post("/loginUser", loginUser); // Felhasználó belépés
app.get("/listUsers", verify, listUsers); // Felhasználók megjelenítése

// Game methods - Minden olyan funkció, ami a játékhoz tartozik

const createGame = require("./methods/game/createGame"); // Játék létrehozása
const getGame = require("./methods/game/getGame"); // Játék adatok lekérdezése
const getGameID = require("./methods/game/getGameID"); // Játék azonosító lekérdezése
const listGames = require("./methods/game/listGames"); // Játékok lekérdezése

app.post("/createGame", verify, createGame);
app.post("/getGame", verify, getGame);
app.post("/getGameID", getGameID);
app.get("/listGames", verify, listGames);

// Player methods - Minden olyan funkció, ami a játékosokhoz tartozik

const addPlayer = require("./methods/player/addPlayer"); // Játékos hozzásadáse
const updateLocation = require("./methods/player/updateLocation"); // Játékos pozició frissítés
const getPlayerData = require("./methods/player/getPlayerData"); // Játékos adatainak lekérdezése
const listPlayers = require("./methods/player/listPlayers"); // Adott játékban lévő játékosok lekérdezése

app.post("/addPlayer", verify, addPlayer);
app.post("/updateLocation", verify, updateLocation);
app.post("/listPlayers", verify, listPlayers);
app.get("/getPlayerData", verify, getPlayerData);

/*
Abban az esetben, hogyha semmilyen útba nem tartozik a kérés, akkor ide kerülünk.
Ezt használjuk hibakezelésnek
*/

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV == "prod" ? "⛔️" : error.stack,
  });
});


// Megadjuk milyen porton fusson a szerver
const port = process.env.PORT || 1337;

// Létrehozzuk a szervert az adott porton
app.listen(port, () => {
  console.log(`Listening on PORT: ${port}`);
});
