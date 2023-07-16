const express = require("express");

const ctrl = require("../../controllers/auth-controller");

const { authenticate, validateBody, upload } = require("../../middlewares");
const { schemas } = require("../../models/user-model");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Sign up a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: Email in use
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get("/verify/:verificationToken", ctrl.verify);

/**
 * @swagger
 * /users/verify/{verificationToken}:
 *   get:
 *     summary: Verify email
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: Verification successful
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: User not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 *
 */

router.post("/verify", validateBody(schemas.emailSchema), ctrl.resendVerify);

/**
 * @swagger
 * /users/verify:
 *   post:
 *     summary: Re-verification of email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *                 example: johnsmith@gmail.com
 *                 description: User's email
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: Verification email sent
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: Verification has already been passed
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: User not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 *
 */

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example:
 *                     - Email or password is wrong
 *                     - Email is not verified
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.post("/logout", authenticate, ctrl.logout);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out
 *     security:
 *       - Authorization: []
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: No Content
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.get("/current", authenticate, ctrl.getCurrent);

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Current
 *     security:
 *       - Authorization: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: User not found
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

router.patch(
  "/update",
  authenticate,
  upload.single("avatar"),
  ctrl.updateUserProfile
);

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update profile
 *     security:
 *       - Authorization: []
 *     tags: [Users]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   example: No file uploaded
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/500'
 *         description: Internal Server Error
 */

module.exports = router;
