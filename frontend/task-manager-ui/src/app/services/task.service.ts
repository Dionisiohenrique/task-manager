import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  TaskItem,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskMetrics,
  TaskFilterOptions,
  TaskItemStatus
} from '../models/task.model';
import { environment } from '../../environments/environment';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  // Signals for state management
  readonly tasks = signal<TaskItem[]>([]);
  readonly metrics = signal<TaskMetrics | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly toasts = signal<ToastMessage[]>([]);

  private toastCounter = 0;

  constructor() {
    this.refreshAll();
  }

  refreshAll(filters?: Partial<TaskFilterOptions>): void {
    this.loadTasks(filters).subscribe();
    this.loadMetrics().subscribe();
  }

  loadTasks(filters?: Partial<TaskFilterOptions>): Observable<TaskItem[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.priority) {
      params = params.set('priority', filters.priority);
    }
    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters?.descending !== undefined) {
      params = params.set('descending', filters.descending.toString());
    }

    return this.http.get<TaskItem[]>(this.apiUrl, { params }).pipe(
      tap((tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        const errMsg = err?.error?.message || 'Failed to load tasks from server.';
        this.error.set(errMsg);
        this.addToast(errMsg, 'error');
        return throwError(() => err);
      })
    );
  }

  loadMetrics(): Observable<TaskMetrics> {
    return this.http.get<TaskMetrics>(`${this.apiUrl}/metrics`).pipe(
      tap((metrics) => {
        this.metrics.set(metrics);
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`);
  }

  createTask(dto: CreateTaskRequest): Observable<TaskItem> {
    this.loading.set(true);
    return this.http.post<TaskItem>(this.apiUrl, dto).pipe(
      tap((created) => {
        this.loading.set(false);
        this.tasks.update((tasks) => [created, ...tasks]);
        this.loadMetrics().subscribe();
        this.addToast(`Task "${created.title}" created successfully!`, 'success');
      }),
      catchError((err) => {
        this.loading.set(false);
        const errMsg = err?.error?.title || err?.error?.message || 'Failed to create task.';
        this.addToast(errMsg, 'error');
        return throwError(() => err);
      })
    );
  }

  updateTask(id: number, dto: UpdateTaskRequest): Observable<TaskItem> {
    this.loading.set(true);
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, dto).pipe(
      tap((updated) => {
        this.loading.set(false);
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === id ? updated : t))
        );
        this.loadMetrics().subscribe();
        this.addToast(`Task "${updated.title}" updated successfully!`, 'success');
      }),
      catchError((err) => {
        this.loading.set(false);
        const errMsg = err?.error?.title || err?.error?.message || 'Failed to update task.';
        this.addToast(errMsg, 'error');
        return throwError(() => err);
      })
    );
  }

  updateStatus(id: number, status: TaskItemStatus): Observable<TaskItem> {
    return this.http.patch<TaskItem>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap((updated) => {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === id ? updated : t))
        );
        this.loadMetrics().subscribe();
        this.addToast(`Task status updated to ${status}.`, 'info');
      }),
      catchError((err) => {
        const errMsg = err?.error?.message || 'Failed to update status.';
        this.addToast(errMsg, 'error');
        return throwError(() => err);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loading.set(false);
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
        this.loadMetrics().subscribe();
        this.addToast('Task deleted successfully.', 'info');
      }),
      catchError((err) => {
        this.loading.set(false);
        const errMsg = err?.error?.message || 'Failed to delete task.';
        this.addToast(errMsg, 'error');
        return throwError(() => err);
      })
    );
  }

  addToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = ++this.toastCounter;
    this.toasts.update((current) => [...current, { id, message, type }]);

    setTimeout(() => {
      this.removeToast(id);
    }, 4500);
  }

  removeToast(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
