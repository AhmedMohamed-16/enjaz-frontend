export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  tasks: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}
