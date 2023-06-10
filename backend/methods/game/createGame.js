const bcrypt = require("bcrypt");
const crypto = require("crypto");
const yup = require("yup");
const escapeHtml = require("escape-html");
const mongoose = require("mongoose");

const Game = require("../../collections/game");
const Team = require("../../collections/team");
const Map = require("../../collections/map");
const Object = require("../../collections/object");

const { trimmedString, dateTime, adminArray, locationArray, objectsArray } = require("../../schema");

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      name: trimmedString.max(255),
      password: trimmedString,
      date: dateTime,

      //admins: adminArray,

      //map: locationArray,
      //objects: objectsArray,

      token: trimmedString,
    });

    await schema.validate(req.body);

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const map = new Map({
      user_id: new mongoose.Types.ObjectId(req.user.user_id),
      location: req.body.map,
    });

    const savedMap = await map.save();

    const game = new Game({
      id: crypto.randomBytes(8).toString("hex"),
      name: escapeHtml(req.body.name),
      map_id: savedMap._id,
      date: req.body.date,
      password: hash,
      status: 0,
    });

    const savedGame = await game.save();

    const teamIds = new Array();

    for (const image of req.body.images) {
      const team = new Team({
        image,
        game_id: savedGame._id,
        point: 0,
      });

      const savedTeam = await team.save();

      teamIds.push(savedTeam._id);
    }

    const object = new Object({
      map_id: savedMap._id,
      objects: req.body.objects.map((object) => ({ ...object, team_id: teamIds[object.team - 1] })),
    });

    await object.save();

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
