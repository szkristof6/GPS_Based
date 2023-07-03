const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");

require("dotenv").config();

const app = express();
app.disable("x-powered-by");

app.use(
	cors({
		origin: process.env.CLIENT_URI,
		optionsSuccessStatus: 200,
	})
);
app.use(helmet());
app.use(fileUpload());

// Apply the rate limiting middleware to all requests
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);

const verify = require("./verify");
const pictureUpload = require("./methods/image/picture");
const servePicture = require("./methods/image/servePicture");

app.post("/upload/picture", verify, pictureUpload);
app.get("/p/:hash", verify, servePicture);

app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
});
