const yup = require("yup");

const loginSchema = yup.object().shape({
  email: yup.string().email().lowercase().trim().required(),
  password: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const googleSchema = yup.object().shape({
  credential: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const facebookSchema = yup.object().shape({
  accessToken: yup.string().trim().required(),
  status: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const registerSchema = yup.object().shape({
  firstname: yup.string().trim().required(),
  lastname: yup.string().trim().required(),
  email: yup.string().email().lowercase().trim().required(),
  password: yup.string().trim().required(),
  passwordre: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .trim()
    .required(),
  token: yup.string().trim().required(),
});

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

module.exports = { loginSchema, registerSchema, googleSchema, facebookSchema, forgotSchema, resetSchema, verifySchema };

/* User:

id: int
username: string
password: string
email: string
login_method: string
image: url
permission: int

*/
