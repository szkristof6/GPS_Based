const Game = require("../../collections/game");
const Map = require("../../collections/map");
const Object = require("../../collections/object");
const Team = require("../../collections/team");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const game = await Game.findOne({ _id: game_id }, { projection: { status: 1 } });
		const map = await Map.findOne({ _id: game.map_id }, { projection: { location: 1 } });
		const object = await Object.findOne({ map_id: map._id }, { projection: { type: 1, location: 1, _id: 1, team_id: 1 } });
		const teams = await Team.find({ game_id: game._id }, { projection: { _id: 1, image: 1, point: 1 } });

		const objectsWithPictures = object.objects.map((object) => ({
			type: object.type,
			location: object.location,
			id: object._id,
			team: {
				image: teams.filter((x) => x._id === object.team_id)[0].image,
			},
		}));

		return res.send({
			status: "success",
			game,
			map,
			objects: objectsWithPictures,
			teams: teams.map((team) => ({ image: team.image, point: team.point })),
		});
	} catch (error) {
		return res.send(error);
	}
};
