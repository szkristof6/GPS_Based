const fastify = require("fastify")({ logger: true });

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

fastify.register(require("@fastify/cors"), {
/*
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname
    if(hostname === process.env.NODE_ENV === "dev" ? "localhost" : "map.stagenex.hu"){
      cb(null, true)
      return
    }
    cb(new Error("Not allowed"), false)
  }
*/
});
fastify.register(require("@fastify/helmet"), { global: true });
fastify.register(require("@fastify/jwt"), { secret: process.env.TOKEN_KEY });
fastify.register(import("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429);
    error.message = "You hit the rate limit! Slow down please!";
  }
  return reply.send(error);
});

/*
JWT tokent használunk azonosításra.
Ez azért jó, mert nem a szerveren tartjuk számon a felhasználót, mint egy session alapu azonosításban, 
Hanem a kliensen tároljuk ezt a tokent, hogyha bármi történne a kapcsolattal, ne veszítsük el a felhasználóval a kapcsolatot

Hogyha egy adott útban szerepel a verify cimke, akkor az azt jelenti, hogy egy védett út,
szóval csak egy érvényes tokennel rendelkező felhasználó tudja elérni az adott utat
*/

fastify.decorate("verify", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.send(error);
  }
});

module.exports = fastify;
