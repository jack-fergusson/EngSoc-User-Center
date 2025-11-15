import request from "supertest";
import app from "../src/app"; // wherever your Express app is exported

describe("GET /ping", () => {
  it("returns pong", () => {
    return request(app).get("/ping").expect(200).expect("pong");
  });
});
