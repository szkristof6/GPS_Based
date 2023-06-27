const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const File = require("../../collections/file");

require("dotenv").config();

// Supported file types
const supportedFormats = ["jpg", "jpeg", "png", "webp"];

// API endpoint to retrieve the current public image
module.exports = async function (request, reply) {
  if (!request.verified) return reply.code(400).send({ status: "error", message: "Not allowed!" });

  // Logic to fetch the requested image from your server based on the provided hash and format
  const hash = request.params.hash;
  const { width, height } = request.query;

  // Check if the requested format is supported
  if (!hash) {
    return reply.status(400).send({ error: "Server Error!" });
  }

  const file = await File.findOne({ id: hash }, { projection: { type: 1, name: 1 } });

  if (!file) return reply.status(400).send({ error: "Server Error!" });

  // Check if the requested format is supported
  if (!supportedFormats.includes(file.type.toLowerCase())) {
    return reply.status(400).send({ error: "Unsupported file format" });
  }

  const imagePath = path.join(process.cwd(), "uploads", `${file.name}`);

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    return reply.status(404).send({ error: "Image not found" });
  }

  // Read the image file
  let image;
  try {
    image = fs.readFileSync(imagePath);
  } catch (err) {
    return reply.status(500).send({ error: "Failed to read the image file" });
  }

  // Additional validation/sanitization checks on the file data
  if (image.length === 0) {
    return reply.status(400).send({ error: "Invalid image file" });
  }

  // Resize the image if width and height are provided
  if (width && height) {
    try {
      const resizedImage = await sharp(image).resize(Number(width), Number(height)).toBuffer();
      image = resizedImage;
    } catch (err) {
      reply.status(500).send({ error: "Failed to resize the image" });
      return;
    }
  }

  // Set the appropriate response headers
  reply
    .header("Content-Type", `image/${file.type}`)
    .header("Cross-Origin-Resource-Policy", "cross-origin") // Replace with your frontend server's address
    .header("Cross-Origin-Opener-Policy", "cross-origin") // Replace with your frontend server's address
    .header("Access-Control-Allow-Methods", "GET");
  reply.send(image);
};
