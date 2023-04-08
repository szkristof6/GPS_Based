const yup = require("yup");

const forgotSchema = yup.object().shape({
  email: yup.string().email().lowercase().trim().required(),
  token: yup.string().trim().required(),
});

const resetSchema = yup.object().shape({
  user_id: yup.string().trim().length(24).required(),
  user_token: yup.string().trim().required(),
  token: yup.string().trim().required(),
  email: yup.string().email().lowercase().trim().required(),
  password: yup.string().trim().required(),
  passwordre: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .trim()
    .required(),
});

const verifySchema = yup.object().shape({
  user_token: yup.string().trim().required(),
  user_id: yup.string().trim().length(24).required(),
  token: yup.string().trim().required(),
});

module.exports = {
  forgotSchema,
  resetSchema,
  verifySchema,
};
