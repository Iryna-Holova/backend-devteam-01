const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/ingredients-controller");
const { validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

router.get("/list", ctrl.getAll);
router.get("/", validateQuery(schemas.getValidateQueryShema), ctrl.getByName);

module.exports = router;
