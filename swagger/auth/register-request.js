/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - baseURL
 *         - user
 *       properties:
 *         baseURL:
 *           type: string
 *           description: front-end's base url
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               example: Johm Smith
 *               type: string
 *               description: User's name
 *             email:
 *               example: johnsmith@gmail.com
 *               type: string
 *               description: User's email
 *             password:
 *               example: '123456789'
 *               type: string
 *               description: User's password
 */
