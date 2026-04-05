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
    courseNo: { type: String, required: true },

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

// const t = {
//   name: "الرسومات التفاعلية",
//   hours: "3",
//   status: "1",
//   rooms: "",
//   times: "ح ث خ 12:30 13:30",
//   days: "",
//   lecturers: "أ.د. مالك بريك",
//   no: "30807324",
//   sectionNo: "1",
//   remarks: "",
// };

// const ts = {
//   name: "البرمجة  الموجهة للكائنات",
//   hours: "3",
//   status: "1",
//   rooms: "<br><br>null",
//   times: "ح ث 09:30 10:30<br><br>خ 09:30 10:30",
//   days: "<br><br>null",
//   lecturers: " زينب الرحامنه<br><br> زينب الرحامنه",
//   no: "30801203",
//   sectionNo: "1",
//   remarks: "",
// };
