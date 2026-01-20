const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Event Service running on ${PORT}`));
