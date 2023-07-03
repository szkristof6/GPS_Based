const turf = require("@turf/turf");
const { ObjectId } = require("mongodb");

const Game = require("../../collections/game");
const Map = require("../../collections/map");
const Object = require("../../collections/object");
const Team = require("../../collections/team");

module.exports = async function (req, res) {
	try {
		if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
		if (!req.query.g_id) return res.code(400).send({ status: "error", message: "Not allowed!" });

		const { g_id: game_id } = req.query;

		const game = await Game.findOne({ _id: new ObjectId(game_id) });
		const map = await Map.findOne({ _id: new ObjectId(game.map_id) });
		const object = await Object.findOne({ map_id: map._id.toString() });
		const teams = await Team.find({ game_id: game._id.toString() }).toArray();

		const objectsWithPictures = object.objects.map((object) => {
			const filteredTeam = teams.filter((x) => x._id.toString() === object.team_id)[0];

			return {
				type: object.type,
				location: object.location,
				id: object.team,
				team: {
					image: filteredTeam.image,
				},
			};
		});

		const area = turf.points(map.location.map((x) => [x.x, x.y]));

		const center = turf.center(area);

		return res.send({
			status: "success",
			map: { location: map.location, center: { x: center.geometry.coordinates[0], y: center.geometry.coordinates[1] } },
			objects: objectsWithPictures,
		});
	} catch (error) {
		return res.send(error);
	}
};
