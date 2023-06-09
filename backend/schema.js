const yup = require("yup");

const validFileExtensions = { image: ["jpg", "gif", "png", "jpeg", "svg", "webp"] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1;
}

const location = yup.object({
  x: yup.number().required(),
  y: yup.number().required(),
});

module.exports = {
  objectID: yup.string().trim().length(24).required(),
  locationObject: location,
  trimmedString: yup.string().trim().required(),
  passwordMatch: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .trim()
    .required(),
  emailTrimmed: yup.string().email().lowercase().trim().required(),
  dateTime: yup.date().required(),
  numberMin: yup.number().min(0).required(),

  adminArray: yup.array().of(
    yup.object().shape({
      user_id: yup.string().trim().length(24).required(),
    })
  ),
  locationArray: yup.array().of(location),
  objectsArray: yup.array().of(
    yup.object().shape({
      map_id: yup.string().trim().length(24).required(),
      type: yup.string().trim().required(),
      team: yup.number().required(),
      location,
    })
  ),
  image: yup.array().of(
    yup
      .mixed()
      .required()
      .test("is-valid-type", "Not a valid image type", (value) =>
        isValidFileType(value && value.name.toLowerCase(), "image")
      )
  ),
};
