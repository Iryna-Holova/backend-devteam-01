/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - email
 *         - avatarURL
 *         - createdAt
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         avatarURL:
 *           type: string
 *           description: User's avatar
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date of creation user's account
 *       example:
 *         _id: 64a94d5023fe093a63304a13
 *         name: John
 *         email: johnsmith@gmail.com
 *         avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 *         createdAt: 2023-07-10T18:07:54.752Z
 */
