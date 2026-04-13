export class SectionTime {
  #days: number[];
  #startTime: string;
  #endTime: string;
  #startMinutes: number;
  #endMinutes: number;
  #room: string;
  #isOnline: boolean;

  constructor(
    days: number[],
    startTime: string,
    endTime: string,
    startMinutes: number,
    endMinutes: number,
    room: string,
    isOnline: boolean,
  ) {
    this.#days = days;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#startMinutes = startMinutes;
    this.#endMinutes = endMinutes;
    this.#room = room;
    this.#isOnline = isOnline;
  }

  get days() {
    return this.#days;
  }

  get startTime() {
    return this.#startTime;
  }

  get endTime() {
    return this.#endTime;
  }

  get room() {
    return this.#room;
  }

  get isOnline() {
    return this.#isOnline;
  }

  hasConflict(other: SectionTime) {
    const shareDays = this.#days.some((day) => {
      other.#days.includes(day);
    });
    if (!shareDays) return false;

    const timeOverlap =
      this.#startMinutes < other.#endMinutes &&
      this.#endMinutes > other.#startMinutes;

    return timeOverlap;
  }
}
