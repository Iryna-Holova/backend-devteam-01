/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       required:
 *         - token
 *         - user
 *       properties:
 *         token:
 *           type: string
 *           description: User's token
 *         user:
 *           type: object
 *           allOf:
 *             - $ref: '#/components/schemas/UserResponse'
 *       example:
 *            token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWJiNWEwMjQ1NWE0MjVlMzU1NDcxMSIsImlhdCI6MTY4ODk3NDc5NCwiZXhwIjoxNjg5MDU3NTk0fQ.g4GRMa3z5FT1J3cly6M3lupD_WKpq9Ra-fYRYkHnAHs
 *            user:
 *              _id: 64a94d5023fe093a63304a13
 *              name: John
 *              email: johnsmith@gmail.com
 *              avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 *              createdAt: 2023-07-10T18:07:54.752Z
 */
