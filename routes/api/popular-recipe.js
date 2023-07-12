const express = require("express");
const popularRecipeController = require("../../controllers/popular-recipe-controller");

const router = express.Router();

router.get("/", popularRecipeController.getAll);

/**
 * @swagger
 * /api/popular-recipe:
 *   get:
 *     summary: Get popular recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeResponse'
 *               description: An array of popular recipes
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
