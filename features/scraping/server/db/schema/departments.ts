import mongoose, { Schema, model, models } from "mongoose";

const departmentsSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    college: { type: String, ref: "College" },
  },
  {
    timestamps: true,
  },
);

const Department = models.Department || model("Department", departmentsSchema);

export default Department;
