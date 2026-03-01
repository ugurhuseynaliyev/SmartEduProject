import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userID) return res.redirect("/login");

    const user = User.findById(req.session.userID);

    if (!user) return res.redirect("/login");

    next();
  } catch (err) {
    console.error(`Auth Middleware Error: ${err}`);
    res.redirect("/login");
  }
};

export default authMiddleware;
