import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Auth Service running on ${PORT}`));
