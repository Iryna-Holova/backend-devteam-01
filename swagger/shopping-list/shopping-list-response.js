/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingListResponse:
 *       type: object
 *       required:
 *         - ingredientId
 *         - _id
 *         - name
 *         - desc
 *         - img
 *         - recipeId
 *         - measure
 *       properties:
 *         ingredientId:
 *           type: string
 *           description: Ingredient id in shopping list
 *         _id:
 *           type: string
 *           description: Ingredient id
 *         name:
 *           type: string
 *           description: Ingredient name
 *         desc:
 *           type: string
 *           description: Ingredient description
 *         img:
 *           type: string
 *           description: Ingredient image
 *         recipeId:
 *           type: string
 *           description: A recipe ID in shopping list
 *         measure:
 *           type: array
 *           items: string
 *           description: The amount of ingredient
 *       example:
 *         ingredientId:
 *           _id: 640c2dd963a319ea671e365b
 *           name: Chicken
 *           desc: The chicken is a type of domesticated fowl, a subspecies of the red junglefowl (Gallus gallus). It is one of the most common and widespread domestic animals...
 *           img: https://res.cloudinary.com/ddbvbv5sp/image/upload/v1678564123/rw8pn3541bmukb8d3mio.png
 *         recipeId: 64a976c1db13bafb5c02bdee
 *         measure: ["2kg cut into 3cm cubes"]
 */