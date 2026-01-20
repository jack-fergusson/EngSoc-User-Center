const request = require("supertest");
const app = require("../src/app"); // adjust path if needed

describe("GET /ping", () => {
  it("returns pong", () => {
    return request(app)
      .get("/ping")
      .expect(200)
      .expect("pong");
  });
});
