const express = require("express");
const ctrl = require("../../controllers/ingredients-controller");
const router = express.Router();

router.get("/list", ctrl.getAll);
router.get("/", ctrl.getByName);

module.exports = router;
