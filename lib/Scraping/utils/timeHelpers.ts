export const dayMap: Record<string, number> = {
  ح: 0,
  ن: 1,
  ث: 2,
  ر: 3,
  خ: 4,
};

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function parseScheduleData(timesStr: string, roomsStr: string) {
  const timeParts = timesStr
    ? timesStr.split(/<br\s*\/?>+/i).map((s) => s.trim())
    : [];
  const roomParts = roomsStr
    ? roomsStr.split(/<br\s*\/?>+/i).map((s) => s.trim())
    : [];

  const schedules: any[] = [];

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
}