const yup = require("yup");

const teamsSchema = yup.object().shape({
  name: yup.string().trim().required(),
  game_id: yup.string().trim().length(24).required(),
  color: yup.string().trim().required(),
});

const getTeamSchema = yup.object().shape({
  id: yup.string().trim().length(24).required(),
});

module.exports = { teamsSchema, getTeamSchema };
