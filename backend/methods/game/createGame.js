const bcrypt = require("bcrypt");
const crypto = require("crypto");
const yup = require("yup");
const escapeHtml = require("escape-html");

const Game = require("../../collections/game");
const Team = require("../../collections/team");
const Map = require("../../collections/map");
const Object = require("../../collections/object");

const { trimmedString, dateTime, numberMin } = require("../../schema");

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

		const newMap = {
			user_id: req.user.user_id,
			location: req.body.map,
			createdAt: new Date(),
		};

		const savedMap = await Map.insertOne(newMap);

		const newGame = {
			id: crypto.randomBytes(8).toString("hex"),
			name: escapeHtml(req.body.name),
			map_id: savedMap.insertedId.toString(),
			date: req.body.date,
			password: hash,
			status: 0,
			createdAt: new Date(),
		};

		const savedGame = await Game.insertOne(newGame);

		const teamIds = new Array();

		const teamColors = {
			0: "red",
			1: "green",
			2: "yellow",
		};

		for (const index in req.body.images) {
			const newTeam = {
				image: req.body.images[index],
				game_id: savedGame.insertedId.toString(),
				color: teamColors[index],
				point: 0,
				createdAt: new Date(),
			};

			const savedTeam = await Team.insertOne(newTeam);

			teamIds.push(savedTeam.insertedId.toString());
		}

		const newObject = {
			map_id: savedMap.insertedId.toString(),
			objects: req.body.objects.map((object) => ({ ...object, team_id: teamIds[object.team] })),
			createdAt: new Date(),
		};

		await Object.insertOne(newObject);

		return res.send({ status: "success" });
	} catch (error) {
		return res.send(error);
	}
};
