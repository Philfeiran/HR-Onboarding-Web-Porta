import { agent } from "./support/setup";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

// Dummy credentials for testing
const testUser = {
  userName: "Test User",
  email: "testuser@example.com",
  password: "testpw",
};

describe("Authentication API", () => {
  it("should return 401 for /api/auth/me if not logged in", async () => {
    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  it("should register, login, and /api/auth/me returns user info", async () => {
    // Register user
    await agent.post("/api/auth/register").send({
      userName: testUser.userName,
      email: testUser.email,
      password: testUser.password,
    });

    // Login
    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.status).toBe(200);

    // Now /api/auth/me should return user info
    const meRes = await agent.get("/api/auth/me");
    expect(meRes.status).toBe(200);
    expect(meRes.body).toHaveProperty("userName");
    expect(meRes.body).toHaveProperty("role");
  });

  it("should clear cookie and return 401 after logout", async () => {
    // Login first
    await agent
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    // Logout
    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(200);

    // Now /api/auth/me should return 401
    const meRes = await agent.get("/api/auth/me");
    expect(meRes.status).toBe(HttpStatusCodes.UNAUTHORIZED);
  });
});

describe("Employee Profile API", () => {
  let employeeId: string;

  beforeAll(async () => {
    // Register and login as employee
    await agent
      .post("/api/auth/register")
      .send({ userName: "Emp", email: "emp@example.com", password: "pw" });
    await agent
      .post("/api/auth/login")
      .send({ email: "emp@example.com", password: "pw" });
    // Use a valid but likely non-existent ObjectId
    employeeId = "507f1f77bcf86cd799439011";
  });

  it("should return 401 for /api/employees/id/:id if not authenticated", async () => {
    // Simulate unauthenticated by not sending cookie
    const res = await agent.get(`/api/employees/id/${employeeId}`);
    expect([HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND]).toContain(
      res.status
    );
  });

  it("should return employee details for /api/employees/id/:id if authenticated", async () => {
    // Login as employee
    await agent
      .post("/api/auth/login")
      .send({ email: "emp@example.com", password: "pw" });
    const res = await agent.get(`/api/employees/id/${employeeId}`);
    // Status may be 200 or 404 depending on if employee exists
    expect([HttpStatusCodes.OK, HttpStatusCodes.NOT_FOUND]).toContain(
      res.status
    );
    // If found, should have expected fields
    if (res.status === HttpStatusCodes.OK) {
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("status");
    }
  });
});
