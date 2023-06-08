const fs = require("fs");
const sharp = require("sharp");
const path = require('path');


module.exports = async function (request, reply) {
  const uploadDir = "uploads";

  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const data = await request.file();

  if (!data || !data.mimetype.startsWith("image/")) {
    reply.code(400).send({ error: "Only image files are allowed" });
    return;
  }

  const fileExtension = path.extname(data.filename);
  const fileName = data.filename.replace(fileExtension, "");
  const tempFilePath = `${uploadDir}/${fileName}${fileExtension}`;

  const fileStream = fs.createWriteStream(tempFilePath);

  data.file.pipe(fileStream);

  fileStream.on("error", (err) => {
    console.error(err);
    reply.code(500).send({ error: "Internal Server Error" });
  });

  fileStream.on("finish", async () => {
    try {
      // Generate a unique filename for the compressed image
      const uniqueFilename = `${Date.now()}_${fileName}.webp`;

      const tempFileWebpPath = `${uploadDir}/${uniqueFilename}.webp`;

      // Convert the uploaded image to webp format
      await sharp(tempFilePath)
        .toFormat("webp")
        .webp({ quality: 80 }) // Set the desired WEBP quality
        .toFile(tempFileWebpPath);

      // Remove the temporary uploaded file
      fs.unlinkSync(tempFilePath);

      reply.send({ message: "File uploaded and converted to WEBP successfully" });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });
};
