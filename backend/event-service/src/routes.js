const express = require("express");
const router = express.Router();
const Club = require("../models/Club");
const Event = require("../models/Event");
const Subscription = require("../models/Subscription");

const toClub = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString() };
};

const toEvent = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id.toString() };
};

// ── Clubs ─────────────────────────────────────────────────────────────────────

router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find().lean();
    res.json(clubs.map((c) => ({ ...c, id: c._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clubs", async (req, res) => {
  try {
    const club = await Club.create(req.body);
    console.log(`Club created: "${club.name}" (id: ${club._id}) by ${club.createdBy || "unknown"}`);
    res.json(toClub(club));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).lean();
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json({ ...club, id: club._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json({ ...club, id: club._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/clubs/:id", async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    await Subscription.deleteMany({ clubId: req.params.id });
    await Event.deleteMany({ clubId: req.params.id });
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clubs/:id/events", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).lean();
    if (!club) return res.status(404).json({ error: "Club not found" });
    const event = await Event.create({
      ...req.body,
      clubId: req.params.id,
      groupName: club.name,
    });
    res.json(toEvent(event));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Events ────────────────────────────────────────────────────────────────────

router.get("/events", async (req, res) => {
  try {
    const filter = {};
    if (req.query.clubId) filter.clubId = req.query.clubId;
    const events = await Event.find(filter).lean();
    res.json(events.map((e) => ({ ...e, id: e._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/events", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json(toEvent(event));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subscriptions ─────────────────────────────────────────────────────────────

router.get("/subscriptions", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });
    const subs = await Subscription.find({ userId }).lean();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/subscriptions", async (req, res) => {
  try {
    const { userId, clubId } = req.body;
    if (!userId || !clubId) return res.status(400).json({ error: "userId and clubId required" });
    const sub = await Subscription.findOneAndUpdate(
      { userId, clubId },
      { userId, clubId },
      { upsert: true, new: true }
    ).lean();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/subscriptions/:clubId", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });
    await Subscription.deleteOne({ userId, clubId: req.params.clubId });
    res.json({ message: "Unsubscribed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Legacy ────────────────────────────────────────────────────────────────────

router.post("/create", (req, res) => {
  res.json({ message: "Event created successfully" });
});

router.get("/ping", (req, res) => {
  res.json({ message: "Event service is alive!" });
});

module.exports = router;
