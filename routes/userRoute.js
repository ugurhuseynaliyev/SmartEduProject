import express from "express";
import * as authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

router.route("/signup").post(
  [
    body("name").not().isEmpty().withMessage("Please enter your name"),
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom(async (userEmail) => {
        return await User.findOne({ email: userEmail }).then((user) => {
          if (user) return Promise.reject("Email already exists!");
        });
      }),
    body("password").not().isEmpty().withMessage("Please enter a password"),
  ],
  authController.createUser,
);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage);
router.route("/:id").delete(authController.deleteUser);

export default router;
