const yup = require("yup");

const playersSchema = yup.object().shape({
  game: yup.string().trim().required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  team: yup.string().trim().required(),
});

const locationSchema = yup.object().shape({
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
});

module.exports = { playersSchema, locationSchema };

/* Player:

user: id
game: id
location: [x, y]
team: string


*/
