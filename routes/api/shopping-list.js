const express = require("express");
const { validateBody, authenticate, validateId } = require("../../middlewares");
const shoppingListController = require("../../controllers/shopping-list-controller");
const { shoppingListSchemas } = require("../../models/shopping-list-model");

const router = express.Router();

router.get("/", authenticate, shoppingListController.getAll);

/**
 * @swagger
 * /api/shoppping-list:
 *   get:
 *     summary: Get all ingredients from shopping list
 *     security:
 *       - Authorization: []
 *     tags: [Shopping list]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingListResponse'
 *               description: An array of ingredients from shopping list
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.patch(
  "/",
  authenticate,
  validateBody(shoppingListSchemas.createSchema),
  shoppingListController.create
);

/**
 * @swagger
 * /api/shopping-list:
 *   patch:
 *     summary: Add an ingredient to shopping list
 *     security:
 *       - Authorization: []
 *     tags: [Shopping list]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingListRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The Ingredient added to shopping list
 *       400:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The ingredient in a user's list from the recipe is already added
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The ingredient not found / The recipe not found / The ingredient in a user's list not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.patch("/clear", authenticate, shoppingListController.clear);
router.patch("/recipe/:id", authenticate, validateId, shoppingListController.addAllInRecipe);

router.delete(
  "/",
  authenticate,
  validateBody(shoppingListSchemas.createSchema),
  shoppingListController.deleteById
);

/**
 * @swagger
 * /api/shopping-list:
 *   delete:
 *     summary: Delete an ingredient from shopping list
 *     security:
 *       - Authorization: []
 *     tags: [Shopping list]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingListRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The ingredient deleted
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The ingredient is not found with such a measure in a user's list
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.delete("/recipe/:id", authenticate, validateId, shoppingListController.delAllInRecipe);

module.exports = router;
