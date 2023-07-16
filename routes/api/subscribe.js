const express = require('express');

const ctrl = require("../../controllers/subscription-controller");
const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user-model");

const router = express.Router();

router.post("/subscribe", authenticate, validateBody(schemas.emailSchema), ctrl.sendSubscriptionEmail);

/**
 * @swagger
 * /api/subscriptions/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               properties:
 *                 email:
 *                   type: string
 *                   example: johnsmith@gmail.com
 *                   description: User's email
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: Subscription email sent successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: This email is already subscribed to the newsletter
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;