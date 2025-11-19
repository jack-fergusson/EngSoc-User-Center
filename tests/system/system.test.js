// const axios = require("axios");
import axios from "axios";
// const { execSync } = require("child_process");
import { execSync } from "child_process";

const API_URL = "http://localhost:4000";

beforeAll(() => {
  console.log("Starting Docker environment...");
  execSync("docker compose up -d --build", { stdio: "inherit" });

  // Wait for containers to become ready
  console.log("Waiting for services to stabilize...");
  return new Promise((resolve) => setTimeout(resolve, 4000));
}, 90000);

afterAll(() => {
  console.log("Stopping Docker environment...");
  execSync("docker compose down --volumes", { stdio: "inherit" });
}, 90000);

// Test the gateway → auth-service → ping
test("API Gateway proxies /auth/ping", async () => {
  const res = await axios.get(`${API_URL}/auth/ping`);
  expect(res.status).toBe(200);
  expect(res.data).toEqual("pong");
});

// Test the event-service
// test("API Gateway proxies /event/ping", async () => {
//   const res = await axios.get(`${API_URL}/event/ping`);
//   expect(res.status).toBe(200);
//   expect(res.data).toEqual({ message: "event-service ok" });
// });
