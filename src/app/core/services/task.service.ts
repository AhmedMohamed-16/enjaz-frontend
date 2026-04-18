import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaskModel, TaskQueryParams, CreateTaskDto, UpdateTaskDto, TaskPagination, TaskStats } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(params: TaskQueryParams = {}): Observable<{tasks: TaskModel[], pagination: TaskPagination}> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<{ data: { tasks: TaskModel[], page: number, totalPages: number, totalCount: number } }>(
      this.baseUrl,
      { params: httpParams }
    ).pipe(
      map((response) => ({
        tasks: response.data.tasks,
        pagination: {
          page: response.data.page,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount
        }
      }))
    );
  }

  getTask(id: string): Observable<TaskModel> {
    return this.http.get<TaskModel>(`${this.baseUrl}/${id}`);
  }

  createTask(data: CreateTaskDto): Observable<TaskModel> {
    return this.http.post<TaskModel>(this.baseUrl, data);
  }

  updateTask(id: string, data: UpdateTaskDto): Observable<TaskModel> {
    return this.http.put<TaskModel>(`${this.baseUrl}/${id}`, data);
  }

  updateStatus(id: string, status: TaskModel['status']): Observable<TaskModel> {
    return this.http.patch<TaskModel>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStats(): Observable<TaskStats> {
    return this.http.get<{ data: TaskStats }>(`${this.baseUrl}/stats`).pipe(
      map(response => response.data)
    );
  }
}
