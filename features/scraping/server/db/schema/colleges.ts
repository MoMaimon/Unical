import { Schema, model, models } from "mongoose";

const collegesSchema = new Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const College = models.College || model("College", collegesSchema);

export default College;
