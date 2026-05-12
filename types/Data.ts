export interface Data {
    id: string;
    arabicName: string;
    englishName: string;
}

export interface Degree extends Data { }

export interface College extends Data { }

export interface Department extends Data {
    collegeId: string;
}

export interface Course {
    id: string; 
    name: string;
    code: string;
    degreeId: string;
    departmentId: string;
    creditHours: number;
}

export interface Section {
    id: string;
    course: string;
    lecturer: string;
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
    section:string;
    room:string;
    isOnline:boolean;
}

