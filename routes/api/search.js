const express = require("express");

const ctrlRecipes = require("../../controllers/recipes-controller");
const { validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/", validateQuery(schemas.getSearchByNameSchema), ctrlRecipes.getSearchByName);

module.exports = router;
