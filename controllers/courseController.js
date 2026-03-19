import Course from "../models/Course.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", `${course.name} has been created succesfully!`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.status(400).redirect("/courses");
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    const category = await Category.findOne({ slug: categorySlug });
    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      ((filter.name = ""), (filter.category = null));
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");

    const categories = await Category.find();
    res
      .status(200)
      .render("courses", { courses, categories, page_name: "courses" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user",
    );
    const categories = await Category.find();

    res.status(200).render("course-single", {
      course,
      page_name: "courses",
      user,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userID, {
      $addToSet: { courses: req.body.course_id },
    });

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", error });
  }
};

export const releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await User.findByIdAndUpdate(req.session.userID, {
      $pull: { courses: req.body.course_id },
    });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({ slug: req.params.slug });

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;  
    course.category = req.body.category;
    await course.save();

    req.flash("success", `${course.name} has been updated successfully!`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.status(400).redirect("/users/dashboard");
  }
};
