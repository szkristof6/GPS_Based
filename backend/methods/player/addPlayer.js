const mongoose = require("mongoose");
const yup = require("yup");

const Player = require("../../collections/player");
const Location = require("../../collections/location");
const Moderator = require("../../collections/moderator");
const User = require("../../collections/user");

const { setCookie } = require("../cookie");

const { objectID, locationObject } = require("../../schema");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      location: locationObject,
      team_id: objectID,
    });

    await schema.validate(req.body);

    const game_id = new mongoose.Types.ObjectId(gameID.value);
    const user_id = new mongoose.Types.ObjectId(req.user.user_id);
    const team_id = new mongoose.Types.ObjectId(req.body.team_id);

    const isModerator = await Moderator.findOne({ game_id, user_id }).then((moderator) => (moderator ? true : false));
    const isAdmin = await User.findOne({ _id: user_id }).then((user) => (user.permission === 10 ? true : false));
    if (isModerator || isAdmin) return res.send({ status: "moderator" });

    const existing = await Player.findOne({ game_id, user_id });
    if (existing) {
      res = setCookie("p_id", existing._id.toString(), res);
      return res.send({ status: "inplay" });
    }

    const player_id = new mongoose.Types.ObjectId();

    const location = new Location({
      _id: new mongoose.Types.ObjectId(),
      location: req.body.location,
      player_id,
      game_id,
    });

    const player = new Player({
      _id: player_id,
      user_id,
      game_id,
      location_id: location._id,
      team_id,
      point: 0,
    });

    await location.save();
    await player.save();

    res = setCookie("p_id", player._id.toString(), res);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
