const express = require("express");

const ctrlRecipes = require("../../controllers/recipes-controller");
const { validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get(
  "/",
  validateQuery(schemas.getValidateQueryShema),
  ctrlRecipes.getSearchByName
);

/**
 * @swagger
 * /api/search?q=title:
 *   get:
 *     summary: Get a recipe by the title
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: A recipe title
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: false
 *         description: Page of recipes
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         required: false
 *         description: Items per page
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 total:
 *                   example: 1
 *                   description: The total number of recipes
 *                 pages:
 *                   example: 1
 *                   description: The total amount of pages of recipes
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeResponse'
 *                   description: An array of recipes
 *               definitions:
 *                 recipes:
 *                   $ref: '#/components/schemas/RecipeResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: No recipes found by the title
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
