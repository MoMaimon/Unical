export interface CourseQuery {
  page: number;
  limit: number;
  filter?: string;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  }[];
}
