export interface Data {
    id: string;
    arabic_name: string;
    english_name: string;
}

export interface Degree extends Data { }

export interface College extends Data { }

export interface Department extends Data {
    college: College;
}

export interface Course {
    id: string; 
    name: string;
    code: string;
    degree: Degree;
    department: Department;
    creditHours: number;
}

export interface Section {
    id: string;
    course: Course;
    lecturer: Lecturer;
    schedule: SchedulePart[];
    sectionNo: number;
    status:number;
}

export interface Lecturer {
    id: string;
    name: string;
}

export interface SchedulePart {
    id:string;
    day:number[];
    startTime:string;
    endTime:string;
    startMinutes:number;
    endMinutes:number;
    section:Section;
    room:string;
    isOnline:boolean;
}

