/**
 * @swagger
 * components:
 *   schemas:
 *     PaginatedRecipeResponse:
 *       type: object
 *       required:
 *         - total
 *         - pages
 *         - recipes
 *       properties:
 *         total:
 *           type: number
 *           example: 1
 *           description: The total number of recipes
 *         pages:
 *           type: number
 *           example: 1
 *           description: The amount of pages based on limit query
 *         recipes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeResponse'
 *           description: An array of recipes
 *       definition:
 *         recipes:
 *           - $ref: '#/components/schemas/RecipeResponse'
 */
