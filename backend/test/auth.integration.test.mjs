import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("Auth integration (register/login/me/refresh/logout)", () => {
  let mongod;
  let app;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();

    const db = await import("../../backend/src/config/database.js");
    await db.connect();

    const appMod = await import("../../backend/src/app.js");
    app = appMod.default();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  test("Full auth flow", async () => {
    const email = `test+${Math.random().toString(36).slice(2, 8)}@example.com`;
    const password = "Password123";

    // Register
    let res = await request(app)
      .post("/auth/register")
      .send({ email, password })
      .set("Accept", "application/json");
    expect(res.status).toBe(201);
    const access = res.body.tokens.accessToken;
    const refresh = res.body.tokens.refreshToken;
    expect(access).toBeDefined();
    expect(refresh).toBeDefined();

    // Login
    res = await request(app)
      .post("/auth/login")
      .send({ email, password })
      .set("Accept", "application/json");
    expect(res.status).toBe(200);

    // Get /me
    res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${access}`);
    expect(res.status).toBe(200);

    // Refresh
    res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: refresh });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();

    // Logout
    res = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: res.body.refreshToken });
    expect(res.status).toBe(204);
  });
});
