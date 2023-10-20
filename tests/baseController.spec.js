const request = require("supertest");
const app = require("../index");
require("dotenv").config();

describe("GET /api/v1/users", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/api/v1/users");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});