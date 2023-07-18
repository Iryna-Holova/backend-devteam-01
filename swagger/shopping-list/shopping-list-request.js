/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingListRequest:
 *       type: object
 *       required:
 *         - ingredientId
 *         - recipeId
 *         - measure
 *       properties:
 *         ingredientId:
 *           type: string
 *           description: Ingredient id in shopping list
 *         recipeId:
 *           type: string
 *           description: A recipe ID in shopping list
 *         measure:
 *           type: string
 *           description: The amount of ingredient
 *       example:
 *         ingredientId: 640c2dd963a319ea671e3796
 *         recipeId: 64a976c1db13bafb5c02bdee
 *         measure: "2kg cut into 3cm cubes"
 */
