const express = require("express");

const ctrlCategories = require("../../controllers/categories-controller");
const ctrlRecipes = require("../../controllers/recipes-controller");
const {
  validateParams,
  validateId,
  validateQuery,
} = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get("/category-list", ctrlCategories.getAllCategories);

/**
 * @swagger
 * /api/recipes/category-list:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get(
  "/main-page",
  validateQuery(schemas.limitMainPageSchema),
  ctrlRecipes.getMainPage
);

/**
 * @swagger
 * /api/recipes/main-page:
 *   get:
 *     summary: Get recipes by category
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Items per page
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 Breakfast:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeResponse'
 *                   description: An array of recipes sorted by category
 *               definitions:
 *                 Breakfast:
 *                   $ref: '#/components/schemas/RecipeResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get(
  "/category/:category",
  validateParams(schemas.getByCategoryParamsSchema),
  validateQuery(schemas.getValidateQueryShema),
  ctrlRecipes.getRecipesByCategory
);





router.get("/:id", validateId, ctrlRecipes.getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
