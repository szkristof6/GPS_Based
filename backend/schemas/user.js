const yup = require("yup");

const usersSchema = yup.object().shape({
  username: yup.string().trim().required(),
});

module.exports = usersSchema;

/* User:

username: string
permission: int
image: url

*/
