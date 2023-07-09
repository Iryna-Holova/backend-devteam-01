const express = require("express");

const ctrl = require("../../controllers/categories-controller");
const ctrlRecipes = require("../../controllers/recipes-controller");
const {
  validateBody,
  validateParams,
  validateId,
} = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/category-list", ctrl.getAllCategories);
router.get(
  "/main-page",
  validateBody(schemas.limitMainPageSchema),
  ctrlRecipes.getMainPage
);
router.get(
  "/category/:category",
  validateParams(schemas.getByCategoryParamsSchema),
  validateBody(schemas.getByCategoryBodySchema),
  ctrlRecipes.getRecipesByCategory
);

router.get("/:id", validateId, ctrlRecipes.getRecipeById);

module.exports = router;
