import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("USER NOT FOUND!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("INCORRECT PASSWORD!");
    }

    // Create Session
    req.session.userID = user._id;
    req.session.user = user.email;
    return res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

export async function getDashboardPage(req, res) {
  const user = await User.findOne({ _id: req.session.userID });
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
  });
}
