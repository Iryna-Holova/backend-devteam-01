/**
 * @swagger
 * components:
 *   schemas:
 *     CurrentResponse:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: object
 *           allOf:
 *             - $ref: '#/components/schemas/UserResponse'
 *       example:
 *         user:
 *           _id: 64a94d5023fe093a63304a13
 *           name: John
 *           email: johnsmith@gmail.com
 *           avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 *           createdAt: 2023-07-10T18:07:54.752Z
 */
