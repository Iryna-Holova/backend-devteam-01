const express = require("express");
const { isValidBody, isValidId } = require("../../middlewares");
const ownRecipeController = require("../../controllers/ownRecipes-controller");
const { ownRecipeSchemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/", ownRecipeController.getOwn);

router.post(
  "/",
  isValidBody(ownRecipeSchemas.createSchema),
  ownRecipeController.create
);

router.delete("/:id", isValidId, ownRecipeController.deleteById);

module.exports = router;
