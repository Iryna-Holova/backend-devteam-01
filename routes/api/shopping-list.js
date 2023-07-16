const express = require("express");
const { validateBody, validateId, authenticate } = require("../../middlewares");
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

router.post(
  "/",
  authenticate,
  validateBody(shoppingListSchemas.createSchema),
  shoppingListController.create
);

/**
 * @swagger
 * /api/shopping-list:
 *   post:
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
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.delete(
  "/:id",
  authenticate,
  validateId,
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: An ingredient's id
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
 *                   example: The ingredient in a user's list not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
