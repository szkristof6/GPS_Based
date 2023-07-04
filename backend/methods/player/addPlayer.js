const yup = require("yup");
const { ObjectId } = require("mongodb");

const Player = require("../../collections/player");
const Location = require("../../collections/location");
const Moderator = require("../../collections/moderator");
const User = require("../../collections/user");

const { locationObject } = require("../../schema");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id || !req.query.t_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const schema = yup.object().shape({ location: locationObject });
		await schema.validate(req.body);

		const { g_id: game_id, t_id: team_id } = req.query;
		const { user_id } = req.user;

		const isAdmin = req.user.permission === 10 ? true : false;
		const isModerator = await Moderator.findOne({ game_id, user_id }).then((moderator) => (moderator ? true : false));
		if (isModerator || isAdmin) return res.send({ status: "moderator" });

		const existing = await Player.findOne({ game_id, user_id });
		if (existing) return res.send({ status: "inplay", p_id: existing._id });

		const player_id = new ObjectId();

		const newLocation = {
			_id: new ObjectId(),
			location: req.body.location,
			player_id,
			game_id,
		};

		const newPlayer = {
			_id: player_id,
			user_id,
			game_id,
			location_id: newLocation._id,
			team_id,
			point: 0,
			status: "alive",
			deaths: 0,
		};

		Promise.all([Location.insertOne(newLocation), Player.insertOne(newPlayer)]);

		// res = setCookie("p_id", player._id.toString(), res);

		return res.send({ status: "success", p_id: newPlayer._id });
	} catch (error) {
		return res.send(error);
	}
};
