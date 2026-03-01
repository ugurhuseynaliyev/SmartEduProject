import express from "express";
import pageRoute from "./routes/pageRoute.js";
import mongoose from "mongoose";
import courseRoute from "./routes/courseRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import userRoute from "./routes/userRoute.js";
import session from "express-session";
import MongoStore from "connect-mongo";

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
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/smartedu-db",
    }),
  }),
);

// Routes
app.use((req, res, next) => {
  res.locals.userIN = req.session.userID || null;
  res.locals.userEmail = req.session.user || null;
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
