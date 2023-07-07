const express = require('express');

const ctrl = require('../../controllers/categories-controller');

const router = express.Router();
router.get('/', ctrl.getAllCategories);

module.exports = router;
