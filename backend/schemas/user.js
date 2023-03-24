const yup = require("yup");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().trim().required(),
  token: yup.string().trim().required(),
});

const registerSchema = yup.object().shape({
  firstname: yup.string().trim().required(),
  lastname: yup.string().trim().required(),
  email: yup.string().email().required(),
  password: yup.string().trim().required(),
  passwordre: yup.string().trim().required(),
  date: yup.date().required(),
  token: yup.string().trim().required(),
});

module.exports = { loginSchema, registerSchema };

/* User:

id: int
username: string
password: string
email: string
login_method: string
image: url
permission: int

*/
