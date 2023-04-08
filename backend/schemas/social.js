const yup = require("yup");

const googleSchema = yup.object().shape({
  credential: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const facebookSchema = yup.object().shape({
  accessToken: yup.string().trim().required(),
  status: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

module.exports = {
  googleSchema,
  facebookSchema,
};
