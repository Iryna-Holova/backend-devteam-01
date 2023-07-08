const express = require("express");
const ingredientsController = require("../../controllers/ingredients-controller");
const router = express.Router();

router.get("/list", ingredientsController.getAll);
router.get("/:ingredients", ingredientsController.getByName);

module.exports = router;
