const express = require("express");
const authRouter = express.Router();

const UserModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");


/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - emailId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ben
 *               lastName:
 *                 type: string
 *                 example: Stokes
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: stokesy@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Stokesy@123
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user added successfully
 *                 data:
 *                   type: object
 *                   description: Created user data
 *       400:
 *         description: Bad request / validation failed
 */
authRouter.post("/signUp", async (req, res) => {
  try {
    // validation
    validateSignUpData(req);

    // encryption
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    // generating a token
    const token = await savedUser.getJWT();
    // wrapping it inside a cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    res.json({ message: "user added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid!");
    }

    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // generating a token
      const token = await user.getJWT();
      // wrapping it inside a cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });
      res.json({
        message: "Logged In successfuly",
        data: user,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User Logged Out");
});

module.exports = authRouter;
