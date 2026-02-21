import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  slug: {
    type: String,
    unique: true,
  },
});

CourseSchema.pre("validate", function () {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
