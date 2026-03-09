import User from "../models/User.js";
import Category from "../models/Category.js";
import bcrypt from "bcrypt";
import Course from "../models/Course.js";
import { validationResult } from "express-validator";

export const createUser = async (req, res) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array();
      for (let i = 0; i < errors.length; i++) {
        req.flash("error", errors[i].msg);
      }
      return res.status(400).redirect("/register");
    }

    await User.create(req.body);

    res.status(201).redirect("/login");
  } catch (error) {
    console.error("Register Error:", error);

    if (!res.headersSent) {
      req.flash("error", "Something went wrong. Please try again.");
      res.status(400).redirect("/register");
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User is not exists!");
      return res.status(400).redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Incorrect Password!");
      return res.status(400).redirect("/login");
    }

    // Create Session
    req.session.userID = user._id;
    req.session.user = user.email;
    return res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({
        status: "fail",
        error,
      });
    }
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

export async function getDashboardPage(req, res) {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses",
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
  });
}
