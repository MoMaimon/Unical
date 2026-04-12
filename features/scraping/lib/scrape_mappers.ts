const KNOWN_ONLINE_COURSES = [
  "35004101",
  "35004102",
  "35003101",
  "35003102",
  "35005100",
  "35005101",
];
const dayMap: Record<string, number> = {
  ح: 0,
  ن: 1,
  ث: 2,
  ر: 3,
  خ: 4,
};

/**
 * Cleans and formats the raw lecturer string from the API by splitting on HTML
 * break tags, trimming whitespace, and removing duplicate names.
 * @param {string} lecturer - The raw lecturer HTML.
 * @returns {string} A comma-separated string of unique lecturer names.
 */
const cleanLecturer = (lecturer: string): string => {
  if (!lecturer) return "";
  const names = lecturer
    .split(/<br\s*\/?>+/i)
    .map((name) => name.trim())
    .filter(Boolean);
  return Array.from(new Set(names)).join("، ");
};

/**
 * Converts a 24-hour time string (HH:MM) into total minutes since midnight.
 * @param {string} timeStr - The time string in "HH:MM" format.
 * @returns {number} The total number of minutes.
 */
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Parses raw HTML string data containing times and rooms into an array of structured
 * schedule objects. It aligns matching indices of time slots and room assignments.
 * @param {string} timesStr - The raw HTML string containing days and times.
 * @param {string} roomsStr - The raw HTML string containing room assignments.
 * @returns {Array<Object>} An array of objects representing structured schedules (days, times, room, etc.).
 */
const parseScheduleData = (timesStr: string, roomsStr: string) => {
  const timeParts = timesStr
    ? timesStr.split(/<br\s*\/?>+/i).map((s) => s.trim())
    : [];
  const roomParts = roomsStr
    ? roomsStr.split(/<br\s*\/?>+/i).map((s) => s.trim())
    : [];

  const schedules = [];

  for (let i = 0; i < timeParts.length; i++) {
    const timePart = timeParts[i] || "";
    const roomPart = roomParts[i] || "";

    if (!timePart) continue;

    const tokens = timePart.split(" ").filter(Boolean);
    const days: number[] = [];
    let startTime = "";
    let endTime = "";

    tokens.forEach((token) => {
      if (dayMap[token] !== undefined) {
        days.push(dayMap[token]);
      } else if (token.includes(":")) {
        if (!startTime) startTime = token;
        else endTime = token;
      }
    });

    const isOnline = roomPart.toLowerCase() === "null";

    schedules.push({
      days,
      startTime,
      endTime,
      startMinutes: startTime ? timeToMinutes(startTime) : null,
      endMinutes: endTime ? timeToMinutes(endTime) : null,
      room: isOnline ? "Online" : roomPart,
      isOnline,
    });
  }

  return schedules;
};

/**
 * Transforms a raw section API response object into a formatted data object
 * ready for insertion into the MongoDB `Section` collection.
 * @param {any} section - The raw section data from the external API.
 * @returns {Object} The mapped and cleaned section data.
 */
export const prepareSectionData = (section: any) => {
  const schedules = parseScheduleData(section.times, section.rooms);

  const officialRoomRaw = section.rooms
    ? section.rooms.split(/<br\s*\/?>+/i)[0].trim()
    : "";
  const officialRoom =
    officialRoomRaw.toLowerCase() === "null" ? "" : officialRoomRaw;

  const isKnownOnline = KNOWN_ONLINE_COURSES.includes(section.no);

  return {
    name: section.name,
    status: Number(section.status),
    sectionNo: Number(section.sectionNo),
    courseNo: section.no,
    lecturers: cleanLecturer(section.lecturers),

    schedules: schedules,
    officialRoom: officialRoom,
    isFullyOnline: isKnownOnline,

    // communityRoom: null,
    communityIsOnline: false,
    // confirmationsCount: 0,
  };
};
