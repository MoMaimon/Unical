export type selectType =
  | { name: string; id: string }
  | { no: string; name: string; hours: string };
export type params = {
  data: string;
  params: department | course;
} | null;

type department = { college_id: number };

export type course = {
  degree_id: number;
  college_id: number;
  department_id: number;
  page: number;
};

export type courseResponse = {
  _id: number;
  __v: number;
  name: string;
  degree: number;
  college: number;
  department: number;
  hours: number;
  createdAt: Date;
  updatedAt: Date;
};

export type collegeResponse = {
  _id: number;
  __v: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type degreeResponse = {
  _id: number;
  __v: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type departmentResponse = {
  _id: number;
  __v: number;
  name: string;
  college: number;
  createdAt: Date;
  updatedAt: Date;
};
