const express = require("express");
const {
  validateBody,
  validateId,
  authenticate,
  validateQuery,
} = require("../../middlewares");
const ctrl = require("../../controllers/ownRecipes-controller");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get(
  "/",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  ctrl.getOwn
);

/**
 * @swagger
 * /api/own-recipes:
 *   get:
 *     summary: Get all own recipes
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: false
 *         description: Page of own recipes array
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
 *               $ref: '#/components/schemas/PaginatedRecipeResponse'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.post(
  "/",
  authenticate,
  validateBody(schemas.createOwnRecipeSchema),
  ctrl.create
);

/**
 * @swagger
 * /api/own-recipes:
 *   post:
 *     summary: Add an own recipe
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/RecipeRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The name of the recipe in use
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.delete("/:id", authenticate, validateId, ctrl.deleteById);

/**
 * @swagger
 * /api/own-recipes:
 *   delete:
 *     summary: Delete an own recipe
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A recipe id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
