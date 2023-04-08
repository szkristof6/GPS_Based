const yup = require("yup");

const gamesSchema = yup.object().shape({
  name: yup.string().trim().required(),
  password: yup.string().trim().required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  //token: yup.string().trim().required(),
});

const locationSchema = yup.object().shape({
  player_id: yup.string().trim().required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
});

const joinGameSchema = yup.object().shape({
  id: yup.string().trim().length(15).required(),
  password: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const statusSchema = yup.object().shape({
  game_id: yup.string().trim().length(24).required(),
});

module.exports = { gamesSchema, locationSchema, joinGameSchema, statusSchema };

/* Game:

name: string
location: [x, y]
date: date

*/
