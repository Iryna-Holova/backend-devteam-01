const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/ingredients-controller");
const { validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/recipe-model");

router.get("/list", ctrl.getAll);

/**
 * @swagger
 * /api/ingredients/list:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IngredientResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get("/", validateQuery(schemas.getValidateQueryShema), ctrl.getByName);

/**
 * @swagger
 * /api/ingredients?q=ingredient:
 *   get:
 *     summary: Get a recipe by the ingredient name
 *     tags: [Ingredients]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: A ingredient name
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: false
 *         description: Page of recipes' array
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
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeResponse'
 *                 total:
 *                   example: 1
 *                   description: The total number of recipes
 *               definitions:
 *                 recipes:
 *                   $ref: '#/components/schemas/RecipeResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
