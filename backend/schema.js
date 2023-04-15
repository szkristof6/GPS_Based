const yup = require("yup");

module.exports = {
  objectID: yup.string().trim().length(24).required(),
  locationObject: yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
  }),
  trimmedString: yup.string().trim().required(),
  passwordMatch: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .trim()
    .required(),
  emailTrimmed: yup.string().email().lowercase().trim().required(),
  dateTime: yup.date().required(),
  numberMin: yup.number().min(0).required(),
};
