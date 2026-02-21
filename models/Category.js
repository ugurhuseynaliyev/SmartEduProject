import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

CategorySchema.pre("validate", function () {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
