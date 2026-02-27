import express from "express";
import pageRoute from "./routes/pageRoute.js";
import mongoose from "mongoose";
import courseRoute from "./routes/courseRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import userRoute from "./routes/userRoute.js";
import session from "express-session";

const app = express();

// Connect DB
mongoose
  .connect("mongodb://127.0.0.1:27017/smartedu-db")
  .then(() => console.log("Connected!"));

// Template Engine
app.set("view engine", "ejs");

// Global Variable

global.userIN = null;

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  }),
);

// Routes
app.use((req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
