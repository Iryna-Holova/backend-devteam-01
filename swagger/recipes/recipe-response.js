/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeResponse:
 *       type: object
 *       required:
 *         - _id
 *         - favorite
 *         - createdAt
 *         - updatedAt
 *         - owner
 *       allOf:
 *         - $ref: '#/components/schemas/RecipeRequest'
 *         - type: object
 *           properties:
 *             owner:
 *               type: string
 *               description: ID of a creator of the recipe
 *             _id:
 *               type: string
 *               format: uuid
 *               description: The recipe's ID
 *             favorite:
 *               type: array
 *               items:
 *                 _userId:
 *                   type: string
 *                   format: uuid
 *                   description: User's ID
 *               description: An array of user's ID who liked the recipe
 *             createdAt:
 *               type: string
 *               format: date
 *               description: The time of recipe creation
 *             updatedAt:
 *               type: string
 *               format: date
 *               description: The time of recipe last updation
 *       example:
 *         _id: 6462a8f74c3d0ddd28897fb8
 *         title: Mediterranean Pasta Salad
 *         category: Seafood
 *         area: Italian
 *         instructions: Bring a large saucepan of salted water to the boil Add the pasta, stir once and cook for about 10 minutes or as directed on the packet...
 *         description: A salad made with pasta, vegetables (such as tomatoes, cucumbers, and olives), feta cheese, and a dressing made with olive oil and lemon juice.
 *         thumb: https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg
 *         preview: https://res.cloudinary.com/ddbvbv5sp/image/upload/v1678560402/mwtf7uqrnsxvlpjqtslc.jpg
 *         time: '27'
 *         youtube: https://www.youtube.com/watch?v=HkywCtna9t0
 *         tags: ["Pasta", "Baking"]
 *         ingredients: [{ "id": "640c2dd963a319ea671e3724", "measure": "200 g"}, { "id": "640c2dd963a319ea671e3663", "measure": "250 g" },]
 *         owner: 64ac24e1117efa0bc027de42
 *         favorite: []
 *         createdAt: 2023-07-10T18:07:54.752Z
 *         updatedAt: 2023-07-10T18:07:54.752Z
 */
