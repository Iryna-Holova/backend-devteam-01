const express = require("express");
const { isValidBody, isValidId, authenticate } = require("../../middlewares");
const ownRecipeController = require("../../controllers/ownRecipes-controller");
const { ownRecipeSchemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/", authenticate, ownRecipeController.getOwn);

router.post(
  "/",
  authenticate,
  isValidBody(ownRecipeSchemas.createSchema),
  ownRecipeController.create
);

router.delete("/:id", authenticate, isValidId, ownRecipeController.deleteById);

module.exports = router;
