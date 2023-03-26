const yup = require("yup");

const playersSchema = yup.object().shape({
  game_id: yup.string().trim().required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  team_id: yup.string().trim().required(),
});

module.exports = playersSchema;

/* Player:

user: id
game: id
location: [x, y]
team: string


*/
