const { BASE_URL } = process.env;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "So-Yummi application is built from Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ["./routes/api/*.js", "./swagger/**/*.js"],
};

module.exports = swaggerOptions;
