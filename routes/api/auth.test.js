const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const User = require("../../models/user");

const { DB_HOST_TEST } = process.env;

/**
 * Register
 * 1. Response must have status code 201.
 * 2. The response should return a user object with 2 fields email and subscription, having the data type String.
 * 3. Must be created user in data base
 */

describe("test register route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(3000);
  });

  afterALL(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test correct register data", async () => {
    const registerData = {
      email: "test@test.com",
      password: "testpassword",
    };
    const { body, statusCode } = await request(app)
      .post("auth/register")
      .send(registerData);

    expect(statusCode).toBe(201);
    expect(body.email).toBe(registerData.email);
    expect(body.subscription).toBe("starter");

    const user = User.findOne({ email: registerData.email });
    expect(user.email).toBe(registerData.email);
  });
});


/**
 * Login
 * 1. Response must have status code 200.
 * 2. The token must be returned in the response.
 * 3. The response should return a user object with 2 fields email and subscription, having the data type String.
 */
