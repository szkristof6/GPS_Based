const yup = require("yup");

const gamesSchema = yup.object().shape({
  name: yup.string().trim().required(),
  password: yup.string().trim().required(),
  location: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  token: yup.string().trim().required(),
});

module.exports = gamesSchema;

/* Game:

name: string
location: [x, y]
date: date

*/
