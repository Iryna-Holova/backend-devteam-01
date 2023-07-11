const express = require("express");

const ctrlCategories = require("../../controllers/categories-controller");
const ctrlRecipes = require("../../controllers/recipes-controller");
const { validateParams, validateId, validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/category-list", ctrlCategories.getAllCategories);
router.get("/main-page", validateQuery(schemas.limitMainPageSchema), ctrlRecipes.getMainPage);
router.get(
  "/categories/:category",
  validateParams(schemas.getByCategoryParamsSchema),
  validateQuery(schemas.getValidateQueryShema),
  ctrlRecipes.getRecipesByCategory
);

router.get("/:id", validateId, ctrlRecipes.getRecipeById);

module.exports = router;
