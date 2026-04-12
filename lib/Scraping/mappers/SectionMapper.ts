// mappers/SectionMapper.ts
import { SectionApiResponse } from "../scrape_types";
import { parseScheduleData } from "../utils/timeHelpers";
import { config } from "../config";

function cleanLecturer(lecturer: string): string {
  if (!lecturer) return "";
  const names = lecturer
    .split(/<br\s*\/?>+/i)
    .map((name) => name.trim())
    .filter(Boolean);
  return Array.from(new Set(names)).join("، ");
}

export class SectionMapper {
  static toDbFormat(section: SectionApiResponse) {
    const schedules = parseScheduleData(section.times, section.rooms);

    const officialRoomRaw = section.rooms
      ? section.rooms.split(/<br\s*\/?>+/i)[0].trim()
      : "";
    const officialRoom =
      officialRoomRaw.toLowerCase() === "null" ? "" : officialRoomRaw;

    const isKnownOnline = config.scraping.knownOnlineCourses.includes(section.no);

    return {
      name: section.name,
      status: Number(section.status),
      sectionNo: Number(section.sectionNo),
      courseNo: section.no,
      lecturers: cleanLecturer(section.lecturers),
      schedules,
      officialRoom,
      isFullyOnline: isKnownOnline,
      communityIsOnline: false,
    };
  }
}