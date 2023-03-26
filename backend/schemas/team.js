const yup = require("yup");

const teamsSchema = yup.object().shape({
  name: yup.string().trim().required(),
  game_id: yup.string().trim().required(),
  color: yup.string().trim().required()
});

module.exports = teamsSchema;
