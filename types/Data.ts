export interface Data {
  id: string;
  arabicName: string;
  englishName: string;
}

export interface Degree extends Data {}

export interface College extends Data {}

export interface Department extends Data {
  collegeId: string;
  college?: College;
}

export interface Course extends Data {
  courseCode: string;
  degreeId: string;
  departmentId: string;
  creditHours: number;

  degree?: Degree;
  department?: Department;
  college?: College;
}

export interface SearchCourse extends Omit<
  Course,
  "degreeId" | "departmentId" | "degree" | "department" | "college"
> {}

export interface Section {
  id: string;
  courseId: string;
  lecturerId: string; 
  status: number;
  sectionNo: number;

  course: Course;
  schedule: Times[];
  
}

export interface Lecturer {
  id: string;
  name: string;
}

export interface Times {
  id: string;
  day: number[];
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  section: string;
  room: string;
  isOnline: boolean;
}
