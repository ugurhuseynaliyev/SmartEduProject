import express from "express";
import pageRoute from "./routes/pageRoute.js";
import mongoose from "mongoose";
import courseRoute from "./routes/courseRoute.js";
import categoryRoute from "./routes/categoryRoute.js";

const app = express();

// Connect DB
mongoose
  .connect("mongodb://127.0.0.1:27017/smartedu-db")
  .then(() => console.log("Connected!"));

// Template Engine
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Page Route
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
