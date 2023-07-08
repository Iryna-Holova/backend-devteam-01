const express = require("express");

const ctrl = require("../../controllers/categories-controller");
const ctrlRecipes = require("../../controllers/recipes-controller");
const { isValidBody } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/category-list", ctrl.getAllCategories);
router.get(
  "/main-page",
  isValidBody(schemas.limitMainPageSchema),
  ctrlRecipes.getMainPage
);

module.exports = router;
