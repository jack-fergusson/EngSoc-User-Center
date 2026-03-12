const request = require("supertest");

// ── Mocks must be declared before requiring the app ─────────────────────────
jest.mock("../config/db", () => jest.fn().mockResolvedValue(undefined));
jest.mock("../config/passport", () => jest.fn());

const mockUser = {
  _id: "user-id-123",
  username: "testuser",
  email: "test@example.com",
};

jest.mock("../models/User", () => {
  // Must be a constructor so `new User(...)` works in the register controller
  const MockUser = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
  });
  MockUser.findOne = jest.fn();
  MockUser.register = jest.fn();
  return MockUser;
});

const User = require("../models/User");
const passport = require("passport");
const app = require("../src/app");

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── GET /ping ────────────────────────────────────────────────────────────────
describe("GET /ping", () => {
  it("returns pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.text).toBe("pong");
  });
});

// ── GET /check ───────────────────────────────────────────────────────────────
describe("GET /check", () => {
  it("returns loggedIn false when no session exists", async () => {
    const res = await request(app).get("/check");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ loggedIn: false });
  });
});

// ── POST /register ───────────────────────────────────────────────────────────
describe("POST /register", () => {
  it("returns 400 when username is missing", async () => {
    const res = await request(app)
      .post("/register")
      .send({ email: "a@b.com", password: "pass123" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "All fields are required" });
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "user", password: "pass123" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "All fields are required" });
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "user", email: "a@b.com" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "All fields are required" });
  });

  it("returns 400 when body is empty", async () => {
    const res = await request(app).post("/register").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "All fields are required" });
  });

  it("returns 400 when username already exists", async () => {
    User.findOne.mockResolvedValueOnce(mockUser);
    const res = await request(app)
      .post("/register")
      .send({ username: "testuser", email: "test@example.com", password: "pass123" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Username already exists" });
    expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
  });

  it("registers a new user successfully", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.register.mockResolvedValueOnce(mockUser);
    const res = await request(app)
      .post("/register")
      .send({ username: "newuser", email: "new@example.com", password: "securepass" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "User registered successfully" });
  });

  it("returns 500 when the database throws an error", async () => {
    User.findOne.mockRejectedValueOnce(new Error("DB connection failure"));
    const res = await request(app)
      .post("/register")
      .send({ username: "newuser", email: "new@example.com", password: "pass" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, message: "Server error during registration" });
  });

  it("returns 500 when User.register throws", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.register.mockRejectedValueOnce(new Error("Register failed"));
    const res = await request(app)
      .post("/register")
      .send({ username: "newuser", email: "new@example.com", password: "pass" });
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// ── Unit: check controller ───────────────────────────────────────────────────
describe("check controller (unit)", () => {
  const { check } = require("../controllers/authController");

  it("returns loggedIn true with the user object when authenticated", () => {
    const req = { isAuthenticated: () => true, user: mockUser };
    const res = { json: jest.fn() };
    check(req, res);
    expect(res.json).toHaveBeenCalledWith({ loggedIn: true, user: mockUser });
  });

  it("returns loggedIn false when not authenticated", () => {
    const req = { isAuthenticated: () => false };
    const res = { json: jest.fn() };
    check(req, res);
    expect(res.json).toHaveBeenCalledWith({ loggedIn: false });
  });
});

// ── Unit: logout controller ──────────────────────────────────────────────────
describe("logout controller (unit)", () => {
  const { logout } = require("../controllers/authController");

  it("destroys session, clears cookie, and returns success", () => {
    const res = { clearCookie: jest.fn(), json: jest.fn() };
    const req = {
      logout: jest.fn((cb) => cb(null)),
      session: { destroy: jest.fn((cb) => cb()) },
    };
    logout(req, res);
    expect(req.logout).toHaveBeenCalled();
    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("returns 500 when req.logout passes an error", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = {
      logout: jest.fn((cb) => cb(new Error("logout failed"))),
      session: { destroy: jest.fn() },
    };
    logout(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false });
    expect(req.session.destroy).not.toHaveBeenCalled();
  });
});

// ── Unit: login controller ───────────────────────────────────────────────────
describe("login controller (unit)", () => {
  const { login } = require("../controllers/authController");

  it("returns user object on successful login", () => {
    jest.spyOn(passport, "authenticate").mockImplementation(
      (_strategy, cb) =>
        (_req, _res, _next) =>
          cb(null, mockUser, null)
    );
    const req = { logIn: jest.fn((_user, cb) => cb(null)) };
    const res = { json: jest.fn() };
    const next = jest.fn();

    login(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith("local", expect.any(Function));
    expect(req.logIn).toHaveBeenCalledWith(mockUser, expect.any(Function));
    expect(res.json).toHaveBeenCalledWith({ success: true, user: mockUser });
  });

  it("returns 400 with message when credentials are invalid", () => {
    jest.spyOn(passport, "authenticate").mockImplementation(
      (_strategy, cb) =>
        (_req, _res, _next) =>
          cb(null, false, { message: "Invalid credentials" })
    );
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid credentials",
    });
  });

  it("calls next with error when passport returns an error", () => {
    const authError = new Error("Passport error");
    jest.spyOn(passport, "authenticate").mockImplementation(
      (_strategy, cb) =>
        (_req, _res, _next) =>
          cb(authError, null, null)
    );
    const req = {};
    const res = {};
    const next = jest.fn();

    login(req, res, next);

    expect(next).toHaveBeenCalledWith(authError);
  });

  it("calls next with error when req.logIn fails", () => {
    const loginError = new Error("Session error");
    jest.spyOn(passport, "authenticate").mockImplementation(
      (_strategy, cb) =>
        (_req, _res, _next) =>
          cb(null, mockUser, null)
    );
    const req = { logIn: jest.fn((_user, cb) => cb(loginError)) };
    const res = {};
    const next = jest.fn();

    login(req, res, next);

    expect(next).toHaveBeenCalledWith(loginError);
  });
});
