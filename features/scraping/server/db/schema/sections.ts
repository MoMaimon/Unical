import { Schema, model, models } from "mongoose";

const SchedulePartSchema = new Schema(
  {
    days: [{ type: Number }],
    startTime: { type: String },
    endTime: { type: String },
    startMinutes: { type: Number },
    endMinutes: { type: Number },
    room: { type: String },
    isOnline: { type: Boolean },
  },
  { _id: false },
);

const sectionsSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: Number },
    lecturers: { type: String },
    sectionNo: { type: Number, required: true },
    courseNo: { type: String, ref: "Course", required: true },

    schedules: [SchedulePartSchema],
    officialRoom: { type: String, default: "" },
    isFullyOnline: { type: Boolean, default: false },

    communityRoom: { type: String, default: null },
    communityIsOnline: { type: Boolean, default: false },
    confirmationsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Section = models.Section || model("Section", sectionsSchema);

export default Section;
