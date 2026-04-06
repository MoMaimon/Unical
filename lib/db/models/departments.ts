import mongoose, { Schema, model, models } from "mongoose";

const departmentsSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    college: { type: Number, ref: "College" },
  },
  {
    timestamps: true,
  },
);

const Department = models.Department || model("Department", departmentsSchema);

export default Department;
