import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/event", routes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Event Service running on ${PORT}`));
