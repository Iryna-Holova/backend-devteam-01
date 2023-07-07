/* eslint-disable */
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const { User } = require("../../models/user");

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

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test correct register data", async () => {
    const registerData = {
      email: "example@example.com",
      password: "examplepassword",
    };
    const { body, statusCode } = await request(app)
      .post("/users/register")
      .send(registerData);

    expect(statusCode).toBe(201);
    expect(body.user.email).toBe(registerData.email);
    expect(body.user.subscription).toBe("starter");

    const user = await User.findOne({ email: registerData.email });
    expect(user.email).toBe(registerData.email);
  });
});
