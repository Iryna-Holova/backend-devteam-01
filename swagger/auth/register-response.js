/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterResponse:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - avatarURL
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         avatarURL:
 *           type: string
 *           description: User's avatar
 *       example:
 *          user:
 *            name: Johm Smith
 *            email: johnsmith@gmail.com
 *            avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 */
