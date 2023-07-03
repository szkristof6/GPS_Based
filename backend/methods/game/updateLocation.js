const yup = require("yup");
const { ObjectId } = require("mongodb");

const OutsideArea = require("./outsideArea");

const Player = require("../../collections/player");
const Location = require("../../collections/location");
const Map = require("../../collections/location");

const { locationObject } = require("../../schema");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.p_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { p_id: player_id } = req.query;

		const schema = yup.object().shape({ location: locationObject });

		await schema.validate(req.body);

		const player = await Player.findOne({ _id: new ObjectId(player_id) });
		if (!player) return res.code(400).send({ status: "error", message: "The player was not found!" });

		const map = await Map.findOne({game_id: player.game_id });

		const outside = OutsideArea(map.location, req.body.location);

		const newLocation = {
			location: req.body.location,
			player_id,
			game_id: player.game_id.toString(),
		};

		const savedLocation = await Location.insertOne(newLocation);

		await Player.updateOne({ _id: new ObjectId(player_id) }, { $set: { location_id: savedLocation.insertedId } });
		return res.send({ status: "success", outside });
	} catch (error) {
		return res.send(error);
	}
};
