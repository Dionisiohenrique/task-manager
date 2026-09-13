import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskItem, TaskItemStatus, TaskFilterOptions, CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';
import { TaskMetricsComponent } from '../task-metrics/task-metrics.component';
import { TaskFiltersComponent } from '../task-filters/task-filters.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TaskMetricsComponent,
    TaskFiltersComponent,
    TaskCardComponent,
    TaskModalComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Metrics Row -->
      <app-task-metrics
        [metrics]="taskService.metrics()"
        (filterChanged)="onMetricFilterSelected($event)"
      />

      <!-- Controls & Search -->
      <app-task-filters
        [filters]="filters()"
        [viewMode]="viewMode()"
        (filterChanged)="onFilterChanged($event)"
        (viewModeChange)="viewMode.set($event)"
        (resetFilters)="resetFilters()"
      />

      <!-- Loading State -->
      @if (taskService.loading() && taskService.tasks().length === 0) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading-text">Connecting to C# .NET API & loading tasks...</p>
        </div>
      }

      <!-- Error State -->
      @if (taskService.error()) {
        <div class="error-banner">
          <div class="error-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="error-text">
            <strong>Connection Notice:</strong> {{ taskService.error() }}
            <div class="error-subtext">Make sure the C# API is running at <code>http://localhost:5000</code>.</div>
          </div>
          <button class="btn-retry" (click)="taskService.refreshAll(filters())">
            Retry Connection
          </button>
        </div>
      }

      <!-- Empty State -->
      @if (!taskService.loading() && taskService.tasks().length === 0 && !taskService.error()) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>No tasks found</h3>
          <p>No tasks match your current criteria. Try adjusting your filters or create a new task.</p>
          <button class="btn btn-primary" (click)="modal.openCreate()">
            + Create New Task
          </button>
        </div>
      }

      <!-- Board View (Kanban 3 columns) -->
      @if (viewMode() === 'board' && taskService.tasks().length > 0) {
        <div class="board-grid">
          <!-- Todo Column -->
          <div class="column-card">
            <div class="column-header col-todo">
              <div class="col-title-group">
                <span class="col-indicator dot-todo"></span>
                <span class="col-title">To Do</span>
              </div>
              <span class="col-badge">{{ todoTasks().length }}</span>
            </div>
            <div class="column-body">
              @for (task of todoTasks(); track task.id) {
                <app-task-card
                  [task]="task"
                  (editTask)="modal.openEdit($event)"
                  (deleteTask)="onDeleteTask($event)"
                  (statusChange)="onStatusChange($event)"
                />
              }
              @if (todoTasks().length === 0) {
                <div class="column-empty">No tasks in To Do</div>
              }
            </div>
          </div>

          <!-- In Progress Column -->
          <div class="column-card">
            <div class="column-header col-inprogress">
              <div class="col-title-group">
                <span class="col-indicator dot-inprogress"></span>
                <span class="col-title">In Progress</span>
              </div>
              <span class="col-badge">{{ inProgressTasks().length }}</span>
            </div>
            <div class="column-body">
              @for (task of inProgressTasks(); track task.id) {
                <app-task-card
                  [task]="task"
                  (editTask)="modal.openEdit($event)"
                  (deleteTask)="onDeleteTask($event)"
                  (statusChange)="onStatusChange($event)"
                />
              }
              @if (inProgressTasks().length === 0) {
                <div class="column-empty">No active tasks</div>
              }
            </div>
          </div>

          <!-- Completed Column -->
          <div class="column-card">
            <div class="column-header col-completed">
              <div class="col-title-group">
                <span class="col-indicator dot-completed"></span>
                <span class="col-title">Completed</span>
              </div>
              <span class="col-badge">{{ completedTasks().length }}</span>
            </div>
            <div class="column-body">
              @for (task of completedTasks(); track task.id) {
                <app-task-card
                  [task]="task"
                  (editTask)="modal.openEdit($event)"
                  (deleteTask)="onDeleteTask($event)"
                  (statusChange)="onStatusChange($event)"
                />
              }
              @if (completedTasks().length === 0) {
                <div class="column-empty">No completed tasks yet</div>
              }
            </div>
          </div>
        </div>
      }

      <!-- List View -->
      @if (viewMode() === 'list' && taskService.tasks().length > 0) {
        <div class="list-container">
          @for (task of taskService.tasks(); track task.id) {
            <app-task-card
              [task]="task"
              (editTask)="modal.openEdit($event)"
              (deleteTask)="onDeleteTask($event)"
              (statusChange)="onStatusChange($event)"
            />
          }
        </div>
      }

      <!-- Modal Dialog Component -->
      <app-task-modal #modal (saveTask)="onSaveTask($event)" />
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .board-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(300px, 1fr));
      gap: 1.25rem;
      align-items: start;
    }
    @media (max-width: 900px) {
      .board-grid {
        grid-template-columns: 1fr;
      }
    }
    .column-card {
      background: var(--column-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 480px;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.15rem;
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-surface);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .col-title-group {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }
    .col-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-todo { background: #64748b; }
    .dot-inprogress { background: #3b82f6; }
    .dot-completed { background: #10b981; }

    .col-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .col-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      background: var(--bg-surface-subtle);
      color: var(--text-muted);
    }
    .column-body {
      padding: 0.85rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .column-empty {
      color: var(--text-subtle);
      font-size: 0.825rem;
      text-align: center;
      padding: 2.5rem 1rem;
      font-style: italic;
    }
    .list-container {
      display: flex;
      flex-direction: column;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
      gap: 1rem;
    }
    .spinner {
      width: 38px;
      height: 38px;
      border: 3.5px solid var(--border-color);
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-text {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .error-icon {
      color: #ef4444;
      flex-shrink: 0;
    }
    .error-text {
      flex: 1;
      font-size: 0.875rem;
      color: #ef4444;
    }
    .error-subtext {
      font-size: 0.775rem;
      color: #f87171;
      margin-top: 0.2rem;
    }
    .btn-retry {
      background: var(--bg-surface);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #ef4444;
      font-weight: 600;
      font-size: 0.8rem;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-retry:hover {
      background: rgba(239, 68, 68, 0.15);
    }
    .empty-state {
      background: var(--bg-surface);
      border: 2px dashed var(--border-color);
      border-radius: 16px;
      padding: 3.5rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .empty-icon {
      color: var(--text-subtle);
      background: var(--bg-surface-subtle);
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }
    .empty-state h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }
    .empty-state p {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 0.5rem 0;
      max-width: 400px;
    }
    .btn {
      padding: 0.6rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.15s;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #4338ca;
    }
  `]
})
export class TaskDashboardComponent {
  taskService = inject(TaskService);

  @ViewChild('modal') modal!: TaskModalComponent;

  viewMode = signal<'board' | 'list'>('board');

  filters = signal<TaskFilterOptions>({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    descending: true
  });

  todoTasks = computed(() =>
    this.taskService.tasks().filter((t) => t.status === 'Todo')
  );

  inProgressTasks = computed(() =>
    this.taskService.tasks().filter((t) => t.status === 'InProgress')
  );

  completedTasks = computed(() =>
    this.taskService.tasks().filter((t) => t.status === 'Completed')
  );

  onFilterChanged(partial: Partial<TaskFilterOptions>): void {
    const updated = { ...this.filters(), ...partial };
    this.filters.set(updated);
    this.taskService.loadTasks(updated).subscribe();
  }

  onMetricFilterSelected(ev: { status: string; priority: string }): void {
    const updated = { ...this.filters(), status: ev.status, priority: ev.priority };
    this.filters.set(updated);
    this.taskService.loadTasks(updated).subscribe();
  }

  resetFilters(): void {
    const defaultFilters: TaskFilterOptions = {
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      descending: true
    };
    this.filters.set(defaultFilters);
    this.taskService.loadTasks(defaultFilters).subscribe();
  }

  onStatusChange(ev: { id: number; status: TaskItemStatus }): void {
    this.taskService.updateStatus(ev.id, ev.status).subscribe();
  }

  onDeleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }

  onSaveTask(ev: { isEdit: boolean; id?: number; data: CreateTaskRequest | UpdateTaskRequest }): void {
    if (ev.isEdit && ev.id) {
      this.taskService.updateTask(ev.id, ev.data as UpdateTaskRequest).subscribe();
    } else {
      this.taskService.createTask(ev.data as CreateTaskRequest).subscribe();
    }
  }
}
