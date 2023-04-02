const yup = require("yup");

const playersSchema = yup.object().shape({
  game_id: yup.string().trim().length(24).required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  team_id: yup.string().trim().length(24).required(),
});

const listPlayersSchema = yup.object().shape({
  player_id: yup.string().trim().length(24).required(),
});

module.exports = { playersSchema, listPlayersSchema };

/* Player:

user: id
game: id
location: [x, y]
team: string


*/
