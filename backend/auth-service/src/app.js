const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

module.exports = app;
