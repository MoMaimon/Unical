export interface CourseQuery {
    page: number;
    limit: number;
    filter: {
        searchQuery?: string;
        departmentId?: string;
        credits?: number;
    };
    sort: {
        field: string;
        direction: "asc" | "desc";
    }[];
}