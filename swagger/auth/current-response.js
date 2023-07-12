/**
 * @swagger
 * components:
 *   schemas:
 *     CurrentResponse:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - avatarURL
 *         - verify
 *       properties:
 *         email:
 *           type: string
 *           description: User's email
 *         name:
 *           type: string
 *           description: User's name
 *         avatarURL:
 *           type: string
 *           description: User's avatar
 *         verify:
 *           type: boolean
 *           description: shows if user is verified
 *       example:
 *         email: johnsmith@gmail.com
 *         name: John Smith
 *         avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 *         verify: true
 */
