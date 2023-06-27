const { ObjectId } = require("mongodb");

const Game = require("../../collections/game");
const Map = require("../../collections/map");
const Object = require("../../collections/object");
const Team = require("../../collections/team");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const game = await Game.findOne({ id: req.params.id }, { projection: { status: 1, map_id: 1 } });
		const map = await Map.findOne({ _id: new ObjectId(game.map_id) }, { projection: { location: 1 } });
		const object = await Object.findOne({ map_id: map._id.toString() }, { projection: { objects: 1, _id: 1 } });
		const teams = await Team.find({ game_id: game._id.toString() }, { projection: { _id: 1, image: 1, point: 1 } }).toArray();
		
		const objectsWithPictures = object.objects.map((object) => ({
			type: object.type,
			location: object.location,
			id: object._id,
			team: {
				image: teams.filter((x) => x._id.toString() === object.team_id)[0].image,
			},
		}));

		return res.send({
			status: "success",
			g_id: game._id,
			game,
			map,
			objects: objectsWithPictures,
			teams: teams.map((team) => ({ image: team.image, point: team.point })),
		});
	} catch (error) {
		return res.send(error);
	}
};
