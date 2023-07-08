const express = require('express');

const ctrl = require('../../controllers/categories-controller');
const ctrlRecipes = require('../../controllers/recipes-controller');
const { isValidBody, isValidParams, isValidId } = require('../../middlewares');
const { schemas } = require('../../models/recipe-model');

const router = express.Router();

router.get('/category-list', ctrl.getAllCategories);
router.get('/main-page', isValidBody(schemas.limitMainPageSchema), ctrlRecipes.getMainPage);
router.get(
  '/category/:category',
  isValidParams(schemas.getByCategoryParamsSchema),
  isValidBody(schemas.getByCategoryBodySchema),
  ctrlRecipes.getRecipesByCategory
);

router.get('/:id', isValidId, ctrlRecipes.getRecipeById);

module.exports = router;
