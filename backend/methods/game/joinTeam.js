const yup = require("yup");
const mongoose = require("mongoose");

const Team = require("../../collections/team");

const { setCookie } = require("../cookie");

const { objectID } = require("../../schema");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      id: objectID,
    });

    await schema.validate(req.body);

    const team = await Team.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) });
    if (!team) return res.code(400).send({ status: "error", message: "This team does not exist!" });

    res = setCookie("t_id", team._id.toString(), res);

    return res.send({ status: "success", t_id: team._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
