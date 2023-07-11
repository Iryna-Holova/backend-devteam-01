/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateResponse:
 *       type: object
 *       required:
 *         - message
 *         - name
 *         - avatarURL
 *       properties:
 *         message:
 *           type: string
 *           description: response's message
 *         name:
 *           type: string
 *           description: User's name
 *         avatarURL:
 *           type: string
 *           description: User's avatar
 *       example:
 *         message: User profile updated successfully
 *         user:
 *           name: John Smith
 *           avatarURL: https://www.gravatar.com/avatar/0467c9040c0fe961309f2dc36e94666f?s=200&r=pg&d=identicon
 */
