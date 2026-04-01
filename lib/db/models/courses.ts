import mongoose, { Schema, model, models } from "mongoose";

const coursesSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    degree: { type: Number, ref: "Degree" },
    college: { type: Number, ref: "College" },
    department: { type: Number, ref: "Department" },
    hours: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const Course = models.Course || model("Course", coursesSchema);

export default Course;
