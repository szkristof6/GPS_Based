const jwt = require("jsonwebtoken");
require("dotenv").config();

/*
A megadott JWT tokent ellenőrizni kell a szerveren..
*/
function verifyToken(req, res, next) {
  // Megnézzük, hogy meg van-e adva a JWT token
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    next({ message: "Not authorized!" }); // Amennyiben nem, tovább megyünk..
  }
  try { 
    // Megnézzük, hogy a JWT token helyes-e
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded; // Ha megfelelő a token, akkor a felhasználó adatait hozzáadjuk a request objekthez
  } catch (error) {
    next(error);
  }

  return next();
}

module.exports = verifyToken;
