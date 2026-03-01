const redirectMiddleware = async (req, res, next) => {
  try {
    if (req.session.userID) return res.redirect("/");
    next();
  } catch (err) {
    console.error(`Redirect Middleware Error: ${err}`);
    res.redirect("/login");
  }
};

export default redirectMiddleware;
