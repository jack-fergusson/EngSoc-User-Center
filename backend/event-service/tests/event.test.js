const request = require("supertest");
const app = require("../src/app");

// === GET /ping ===
describe("GET /ping", () => {
  it("responds with alive message", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Event service is alive!" });
  });
});

// === POST /create ===
describe("POST /create", () => {
  it("returns success message with a full event payload", async () => {
    const res = await request(app)
      .post("/create")
      .send({
        title: "EngWeek Kickoff",
        date: "2025-11-15",
        group: "EngSoc",
        category: "Event",
        price: 0,
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Event created successfully" });
  });

  it("returns success message with a partial payload", async () => {
    const res = await request(app)
      .post("/create")
      .send({ title: "Coding Workshop" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Event created successfully" });
  });

  it("returns success message with an empty body", async () => {
    const res = await request(app).post("/create").send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Event created successfully" });
  });

  it("responds with JSON content-type", async () => {
    const res = await request(app).post("/create").send({});
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
