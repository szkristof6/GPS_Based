const yup = require("yup");
const { ObjectId } = require("mongodb");

const Team = require("../../collections/team");

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

		const team = await Team.findOne({ _id: new ObjectId(req.body.id) });
		if (!team) return res.code(400).send({ status: "error", message: "This team does not exist!" });

		// res = setCookie("t_id", team._id.toString(), res);

		return res.send({ status: "success", t_id: team._id });
	} catch (error) {
		return res.send(error);
	}
};