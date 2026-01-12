const app = require("./app.js");
const router = express.Router();

router.post("/create", (req, res) => {
  res.json({ message: "Event created successfully" });
});

router.get("/ping", (req, res) => {
  res.json({ message: "Event service is alive!" });
});

export default router;
