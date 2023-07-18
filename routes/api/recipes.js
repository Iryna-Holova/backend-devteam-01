const express = require("express");

const ctrlCategories = require("../../controllers/categories-controller");
const ctrlRecipes = require("../../controllers/recipes-controller");
const {
  validateParams,
  validateId,
  validateQuery,
  validateBody,
  authenticate,
  upload,
  validateMultipart,
} = require("../../middlewares");
const ctrlPopularRecipe = require("../../controllers/popular-recipe-controller");
const ctrlFavorites = require("../../controllers/favorite-controller");
const { schemas } = require("../../models/recipe-model");
const ctrlOwnRecipes = require("../../controllers/ownRecipes-controller");

const router = express.Router();

router.get(
  "/search",
  validateQuery(schemas.getValidateQueryShema),
  ctrlRecipes.getSearchByName
);

/**
 * @swagger
 * /api/recipes/search?q=title:
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
 *               $ref: '#/components/schemas/PaginatedRecipeResponse'
 *       404:
 *         description: Not Found
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

router.get("/category-list", ctrlCategories.getAllCategories);

/**
 * @swagger
 * /api/recipes/category-list:
 *   get:
 *     summary: Get all categories
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *               description: An array of categories
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
  "/categories/:category",
  validateParams(schemas.getByCategoryParamsSchema),
  validateQuery(schemas.getValidateQueryShema),
  ctrlRecipes.getRecipesByCategory
);

/**
 * @swagger
 * /api/recipes/categories/{category}:
 *   get:
 *     summary: Get a recipe by the ingredient name
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category name
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
 *               $ref: '#/components/schemas/PaginatedRecipeResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: No recipe found in the category
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get(
  "/own",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  ctrlOwnRecipes.getOwn
);

/**
 * @swagger
 * /api/recipes/own:
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
  "/own",
  authenticate,
  upload.single("photo"),
  validateMultipart({ schema: schemas.createOwnRecipeSchema, key: "recipe" }),
  ctrlOwnRecipes.create
);

/**
 * @swagger
 * /api/recipes/own:
 *   post:
 *     summary: Add an own recipe
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RecipeRequest'
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/RecipeRequest'
 *     responses:
 *       201:
 *         description: Created
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

router.delete("/own/:id", authenticate, validateId, ctrlOwnRecipes.deleteById);

/**
 * @swagger
 * /api/recipes/own/{id}:
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
 *         description: Not Found
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

router.get(
  "/favorites",
  validateQuery(schemas.getValidateQueryShema),
  authenticate,
  ctrlFavorites.getAll
);

/**
 * @swagger
 * /api/recipes/favorite:
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
 *         description: Page of favorite recipes
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
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: There are no favorite recipes
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.patch(
  "/favorites",
  authenticate,
  validateBody(schemas.addFavoriteSchema),
  ctrlFavorites.save
);

/**
 * @swagger
 * /api/recipes/favorite:
 *   patch:
 *     summary: Add a recipe to favorite
 *     security:
 *       - Authorization: []
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - recipeId
 *             properties:
 *               recipeId:
 *                 example: 6462a8f74c3d0ddd28897fb8
 *                 type: string
 *                 description: A recipe id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe added succesfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: The recipe has already added to favorite
 *       404:
 *         description: Not Found
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

router.delete(
  "/favorites/:id",
  authenticate,
  validateId,
  ctrlFavorites.deleteById
);

/**
 * @swagger
 * /api/recipes/favorite:
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
 *       404:
 *         description: Not Found
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

router.get("/popular", ctrlPopularRecipe.getAll);

/**
 * @swagger
 * /api/recipes/popular:
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
 *               $ref: '#/components/schemas/RecipeResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: No recipe found with id
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
