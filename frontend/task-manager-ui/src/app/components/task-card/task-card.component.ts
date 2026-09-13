import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem, TaskItemStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card" [class.completed]="task().status === 'Completed'">
      <div class="card-header">
        <div class="status-indicator-group">
          <button
            class="checkbox-btn"
            [class.checked]="task().status === 'Completed'"
            (click)="toggleComplete()"
            [title]="task().status === 'Completed' ? 'Mark as Todo' : 'Mark as Completed'"
            aria-label="Toggle completed"
          >
            @if (task().status === 'Completed') {
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            }
          </button>
          <span class="priority-pill priority-{{ task().priority.toLowerCase() }}">
            {{ task().priority }}
          </span>
        </div>

        <div class="card-actions">
          <button class="action-icon-btn edit-btn" (click)="editTask.emit(task())" title="Edit task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="action-icon-btn delete-btn" (click)="deleteTask.emit(task().id)" title="Delete task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <h4 class="card-title">{{ task().title }}</h4>

      @if (task().description) {
        <p class="card-desc">{{ task().description }}</p>
      }

      <div class="card-footer">
        @if (task().dueDate) {
          <div class="due-date-pill" [class.overdue]="isOverdue(task())">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{{ formatDueDate(task().dueDate!) }}</span>
          </div>
        } @else {
          <div class="no-due-date">No due date</div>
        }

        <div class="status-selector">
          <select
            class="status-dropdown"
            [value]="task().status"
            (change)="onStatusChange($event)"
          >
            <option value="Todo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Done</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 1rem 1.15rem;
      margin-bottom: 0.85rem;
      box-shadow: var(--card-shadow);
      transition: all 0.15s ease-in-out;
    }
    .task-card:hover {
      box-shadow: var(--card-hover-shadow);
      border-color: var(--border-focus);
    }
    .task-card.completed {
      opacity: 0.75;
      background: var(--bg-surface-subtle);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.65rem;
    }
    .status-indicator-group {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }
    .checkbox-btn {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 2px solid var(--border-input);
      background: var(--bg-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      color: #ffffff;
      transition: all 0.15s;
    }
    .checkbox-btn:hover {
      border-color: #4f46e5;
    }
    .checkbox-btn.checked {
      background: #10b981;
      border-color: #10b981;
    }
    .priority-pill {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .priority-high {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }
    .priority-medium {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
    .priority-low {
      background: rgba(14, 165, 233, 0.15);
      color: #0ea5e9;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .action-icon-btn {
      background: none;
      border: none;
      padding: 5px;
      border-radius: 6px;
      color: var(--text-subtle);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .edit-btn:hover {
      background: rgba(59, 130, 246, 0.12);
      color: #3b82f6;
    }
    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
      margin: 0 0 0.45rem 0;
      line-height: 1.35;
    }
    .task-card.completed .card-title {
      text-decoration: line-through;
      color: var(--text-muted);
    }
    .card-desc {
      font-size: 0.825rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin: 0 0 0.75rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.65rem;
      border-top: 1px solid var(--border-color);
      margin-top: 0.2rem;
    }
    .due-date-pill {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .due-date-pill.overdue {
      color: #ef4444;
      font-weight: 600;
    }
    .no-due-date {
      font-size: 0.72rem;
      color: var(--text-subtle);
    }
    .status-dropdown {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--border-input);
      border-radius: 6px;
      background: var(--bg-surface);
      color: var(--text-main);
      cursor: pointer;
      outline: none;
      transition: background-color 0.25s, border-color 0.15s;
    }
    .status-dropdown:focus {
      border-color: var(--border-focus);
    }
  `]
})
export class TaskCardComponent {
  task = input.required<TaskItem>();

  editTask = output<TaskItem>();
  deleteTask = output<number>();
  statusChange = output<{ id: number; status: TaskItemStatus }>();

  toggleComplete(): void {
    const t = this.task();
    const newStatus: TaskItemStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
    this.statusChange.emit({ id: t.id, status: newStatus });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as TaskItemStatus;
    this.statusChange.emit({ id: this.task().id, status: newStatus });
  }

  isOverdue(task: TaskItem): boolean {
    if (!task.dueDate || task.status === 'Completed') return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDueDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}
