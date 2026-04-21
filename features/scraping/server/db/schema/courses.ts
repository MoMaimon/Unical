import mongoose, { Schema, model, models } from "mongoose";

const coursesSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    degree: { type: String, ref: "Degree" },
    college: { type: String, ref: "College" },
    department: { type: String, ref: "Department" },
    hours: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const Course = models.Course || model("Course", coursesSchema);

export default Course;
