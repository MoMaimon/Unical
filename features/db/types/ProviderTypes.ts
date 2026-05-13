export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export interface Query {
  page: number;
  limit: number;
  filter?: string;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  }[];
}
