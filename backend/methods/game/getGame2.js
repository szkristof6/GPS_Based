const Game = require("../../collections/game");
const Map = require("../../collections/map");
const Object = require("../../collections/object");
const Team = require("../../collections/team");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const game = await Game.findOne({ _id: req.params.id });
    const map = await Map.findOne({ _id: game.map_id });
    const object = await Object.findOne({ map_id: map._id });
    const teams = await Team.find({ game_id: game._id });

    const objectsWithPictures = object.objects.map((object) => ({
      type: object.type,
      location: object.location,
      id: object._id,
      team: {
        image: teams.filter(x => x._id.toString() === object.team_id.toString())[0].image
      },
    }));

    return res.send({
      status: "success",
      map: map.location,
      objects: objectsWithPictures,
      teams: teams.map((team) => ({ image: team.image, point: team.point })),
    });
  } catch (error) {
    return res.send(error);
  }
};
