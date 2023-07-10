const express = require("express");
const popularRecipeController = require("../../controllers/popular-recipe-controller");

const router = express.Router();

router.get("/", popularRecipeController.getAll);

module.exports = router;
