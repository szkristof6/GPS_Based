const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const escapeHtml = require("escape-html");
const crypto = require("crypto");
const base64url = require("base64url");

const File = require("../../collections/file");

module.exports = async function (request, reply) {
  if (!request.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

  const uploadDir = "uploads";
  const files = await request.saveRequestFiles();

  if (!files || files.length === 0) {
    return [{ status: "error", message: "No files uploaded" }];
  }

  const uploadPromises = files.map(async (file) => {
    if (!file.mimetype.startsWith("image/")) {
      return { status: "error", message: "Only image files are allowed" };
    }

    const fileExtension = path.extname(file.filename);
    const fileName = escapeHtml(file.filename.replace(fileExtension, ""));
    const tempFilePath = path.join(uploadDir, `${fileName}${fileExtension}`);

    try {
      // Create a readable stream from the file data
      const fileStream = fs.createReadStream(file.filepath);

      // Save the file stream to disk
      await new Promise((resolve, reject) => {
        fileStream.pipe(fs.createWriteStream(tempFilePath)).on("finish", resolve).on("error", reject);
      });

      const uniqueFilename = `${Date.now()}_${fileName}.webp`;
      const tempFileWebpPath = path.join(uploadDir, uniqueFilename);

      // Compress and convert the uploaded image to WebP format
      await sharp(tempFilePath)
        .toFormat("webp")
        .webp({ quality: 80 }) // Set the desired WebP quality
        .toFile(tempFileWebpPath);

      // Remove the temporary uploaded file
      await fs.promises.unlink(tempFilePath);

      const newFile = {
        name: uniqueFilename,
        type: "webp",
        id: base64url(crypto.randomBytes(64).toString("hex")).substring(0, 25),
        user_id: request.user.user_id,
        createdAt: new Date(),
      };

      await File.insertOne(newFile);

      return { status: "success", file: newFile.id };
    } catch (err) {
      console.error(`Error processing file: ${file.filename}`, err);
      return { status: "error", message: `Error processing file: ${file.filename}` };
    }
  });

  const results = await Promise.all(uploadPromises);

  let error = false;
  results.forEach((element) => {
    if (element.status === "error") return reply.code(400).send({ status: "error", message: element.message });
  });

  return reply.send({
    status: error === false ? "success" : "error",
    files: results.map((x) => x.file),
  });
};
