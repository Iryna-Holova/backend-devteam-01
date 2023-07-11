/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       required:
 *         - token
 *         - email
 *         - avatarURL
 *       properties:
 *         token:
 *           type: string
 *           description: User's token
 *         email:
 *           type: string
 *           description: User's email
 *         avatarURL:
 *           type: string
 *           description: User's avatar
 *       example:
 *            token: Johm Smith
 *            user:
 *              email: johnsmith@gmail.com
 *              avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 */
