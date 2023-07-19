/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - instructions
 *         - description
 *         - time
 *         - ingredients
 *         - file
 *         - recipe
 *       properties:
 *         recipe:
 *           type: string
 *           description: Stringified recipe object
 *           example: {"title":"Mediterranean Pasta Salad","category":"Seafood","area":"Italian","instructions":"Bring a large saucepan of salted water to the boil Add the pasta...","description":"A salad made with pasta, vegetables (such as tomatoes...","time": "30","tags": ["Pasta", "Baking"],"ingredients": [{ "id": "640c2dd963a319ea671e3724", "measure": "200 g"}, { "id": "640c2dd963a319ea671e3663", "measure": "250 g" }]}
 *           properties:
 *             title:
 *               type: string
 *               description: The title of recipe
 *             category:
 *               type: string
 *               description: The category of recipe
 *             area:
 *               type: string
 *               description: The area where the recipe came from
 *             instructions:
 *               type: string
 *               description: The instructions how to cook a dish
 *             description:
 *               type: string
 *               description: The description of the recipe
 *             thumb:
 *               type: string
 *               description: The photo of the recipe
 *             preview:
 *               type: string
 *               description: Preview of the recipe photo
 *             time:
 *               type: string
 *               description: The amount of time needed tp cook
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: The search tags of the recipe
 *             ingredients:
 *               type: array
 *               items:
 *                 id:
 *                   type: string
 *                   description: An ingredient's ID
 *                 measure:
 *                   type: string
 *                   description: The amount of ingredient
 *               description: Ingredients' array
 *         file:
 *           type: string
 *           format: binary
 *           description: User's profile photo
 *       example:
 *         title: Mediterranean Pasta Salad
 *         category: Seafood
 *         area: Italian
 *         instructions: Bring a large saucepan of salted water to the boil Add the pasta, stir once and cook for about 10 minutes or as directed on the packet...
 *         description: A salad made with pasta, vegetables (such as tomatoes, cucumbers, and olives), feta cheese, and a dressing made with olive oil and lemon juice.
 *         time: '27'
 *         youtube: https://www.youtube.com/watch?v=HkywCtna9t0
 *         tags: ["Pasta", "Baking"]
 *         ingredients: [{ "id": "640c2dd963a319ea671e3724", "measure": "200 g"}, { "id": "640c2dd963a319ea671e3663", "measure": "250 g" }]
 */
