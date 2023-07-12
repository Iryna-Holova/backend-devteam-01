const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const recipesRouter = require("./routes/api/recipes");
const ownRecipeRouter = require("./routes/api/own-recipes");
const popularRecipeRouter = require("./routes/api/popular-recipe");
const shoppingListRouter = require("./routes/api/shopping-list");
const favoriteRouter = require("./routes/api/favorite");
const ingredientsRouter = require("./routes/api/ingredients");
const subscribeRouter = require("./routes/api/subscribe");
const searchRouter = require("./routes/api/search");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/recipes/", recipesRouter);
app.use("/api/own-recipes", ownRecipeRouter);
app.use("/api/popular-recipe", popularRecipeRouter);
app.use("/api/shopping-list", shoppingListRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/subscriptions", subscribeRouter);
app.use("/api/search", searchRouter);


const { BASE_URL } = process.env

const options = {
  definition: {
    openapi: "3.1.0",
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

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
