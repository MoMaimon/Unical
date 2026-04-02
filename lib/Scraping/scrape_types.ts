export type selectType =
  | { name: string; id: string }
  | { no: string; name: string; hours: string };
export type params = {
  data: string;
  params: department | course;
} | null;

type department = { college_id: number };

type course = {
  degree_id: number;
  college_id: number;
  department_id: number;
  page: number;
};
