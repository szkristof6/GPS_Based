const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const escapeHtml = require("escape-html");
const crypto = require("crypto");
const base64url = require("base64url");

const File = require("../../collections/file");

module.exports = async function (req, res) {
	if (!req.verified) return res.status(400).send({ status: "error", message: "Not allowed!" });

	const uploadDir = "uploads";
	const files = req.files;

	if (!files || Object.keys(files).length === 0) {
		return res.status(400).json({ status: "error", message: "No files uploaded" });
	}

	const response = [];

	for (const fileKey in files) {
		const file = files[fileKey];

		if (!file.mimetype.startsWith("image/")) {
			response.push({ status: "error", message: "Only image files are allowed" });
			continue;
		}

		const fileExtension = path.extname(file.name);
		const fileName = escapeHtml(path.basename(file.name, fileExtension));
		const tempFilePath = path.join(uploadDir, fileName + fileExtension);

		try {
			await file.mv(tempFilePath);

			const uniqueFilename = `${Date.now()}_${fileName}.webp`;
			const tempFileWebpPath = path.join(uploadDir, uniqueFilename);

			const newFile = {
				name: uniqueFilename,
				type: "webp",
				id: base64url(crypto.randomBytes(64).toString("hex")).substring(0, 25),
				user_id: req.user.user_id,
				createdAt: new Date(),
			};

			await File.insertOne(newFile);

			if (req.query.size) {
				const { size } = req.query;

				// Compress and convert the uploaded image to WebP format
				await sharp(tempFilePath)
					.resize({ height: Number(size) })
					.toFormat("webp")
					.webp({ quality: 80 }) // Set the desired WebP quality
					.toFile(tempFileWebpPath);
			} else {
				// Compress and convert the uploaded image to WebP format
				await sharp(tempFilePath)
					.toFormat("webp")
					.webp({ quality: 80 }) // Set the desired WebP quality
					.toFile(tempFileWebpPath);
			}

			fs.unlinkSync(tempFilePath);

			response.push({ status: "success", file: newFile.id });
		} catch (err) {
			console.error(err);
			response.push({ status: "error", message: "Image upload failed" });
		}
	}

	let error = false;
	response.forEach((element) => {
		if (element.status === "error") return reply.code(400).send({ status: "error", message: element.message });
	});

	return res.json({
		status: error === false ? "success" : "error",
		files: response.map((x) => x.file),
	});
};
