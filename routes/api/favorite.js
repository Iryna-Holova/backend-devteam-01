const express = require("express");
const {
  validateBody,
  validateId,
  authenticate,
  validateQuery,
} = require("../../middlewares");
const favoriteController = require("../../controllers/favorite-controller");
const { schemas } = require("../../models/recipe-model");

const router = express.Router();

router.get(
  "/",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  favoriteController.getAll
);

/**
 * @swagger
 * /api/favorite:
 *   get:
 *     summary: Get all favorite recipes
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: false
 *         description: Page of favorite's array
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

router.post(
  "/",
  authenticate,
  validateBody(schemas.addFavoriteSchema),
  favoriteController.save
);

/**
 * @swagger
 * /api/favorite:
 *   post:
 *     summary: Add a recipe to favorite
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 example: johnsmith@gmail.com
 *                 description: User's email
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe added succesfully
 *                   description: Added succesfully
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.delete("/:id", authenticate, validateId, favoriteController.deleteById);

/**
 * @swagger
 * /api/favorite:
 *   delete:
 *     summary: Delete a recipe from favorite
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A recipe's id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe deleted from favorite
 *                   description: A recipe deleted succesfully
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe not found
 *                   description: Not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
