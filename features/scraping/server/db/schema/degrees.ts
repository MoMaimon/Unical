import { Schema, model, models } from "mongoose";

const degreesSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Degree = models.Degree || model("Degree", degreesSchema);

export default Degree;
