const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const recipesRouter = require("./routes/api/recipes");
const ownRecipeRouter = require("./routes/api/ownRecipes");
const shoppingListRouter = require("./routes/api/shopping-list");
const ingredientsRouter = require("./routes/api/ingredients");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/recipes/", recipesRouter);
app.use("/own-recipes", ownRecipeRouter);
app.use("/shopping-list", shoppingListRouter);
app.use("/ingredients", ingredientsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
