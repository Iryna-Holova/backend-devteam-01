const express = require("express");

const ctrl = require("../../controllers/categories-controller");

const router = express.Router();

router.get("/category-list", ctrl.getAllCategories);

module.exports = router;
