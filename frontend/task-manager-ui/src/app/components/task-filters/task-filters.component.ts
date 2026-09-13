import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFilterOptions } from '../../models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          class="input-search"
          placeholder="Search tasks by title or description..."
          [ngModel]="filters().search"
          (ngModelChange)="onSearchChange($event)"
        />
        @if (filters().search) {
          <button class="clear-search-btn" (click)="onSearchChange('')" aria-label="Clear search">
            &times;
          </button>
        }
      </div>

      <div class="filter-controls">
        <!-- Status Filter -->
        <div class="control-group">
          <label class="control-label">Status</label>
          <select
            class="select-control"
            [ngModel]="filters().status"
            (ngModelChange)="updateFilter('status', $event)"
          >
            <option value="">All Statuses</option>
            <option value="Todo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="control-group">
          <label class="control-label">Priority</label>
          <select
            class="select-control"
            [ngModel]="filters().priority"
            (ngModelChange)="updateFilter('priority', $event)"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="control-group">
          <label class="control-label">Sort</label>
          <select
            class="select-control"
            [ngModel]="filters().sortBy"
            (ngModelChange)="updateFilter('sortBy', $event)"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        <!-- View Switcher -->
        <div class="view-toggle">
          <button
            class="toggle-btn"
            [class.active]="viewMode() === 'board'"
            (click)="viewModeChange.emit('board')"
            title="Board view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="18"></rect>
              <rect x="14" y="3" width="7" height="18"></rect>
            </svg>
          </button>
          <button
            class="toggle-btn"
            [class.active]="viewMode() === 'list'"
            (click)="viewModeChange.emit('list')"
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>

        @if (hasActiveFilters()) {
          <button class="btn-reset" (click)="resetFilters.emit()">
            Reset
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.85rem 1.15rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      box-shadow: var(--card-shadow);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .search-box {
      position: relative;
      flex: 1 1 300px;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--text-subtle);
      pointer-events: none;
    }
    .input-search {
      width: 100%;
      padding: 0.55rem 2.2rem 0.55rem 2.4rem;
      border: 1px solid var(--border-input);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--text-main);
      background: var(--bg-input);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s, background-color 0.25s;
    }
    .input-search:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .clear-search-btn {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      font-size: 1.15rem;
      color: var(--text-subtle);
      cursor: pointer;
      line-height: 1;
      padding: 4px 6px;
    }
    .clear-search-btn:hover {
      color: var(--text-main);
    }
    .filter-controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .control-group {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .control-label {
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .select-control {
      padding: 0.45rem 0.75rem;
      font-size: 0.825rem;
      border: 1px solid var(--border-input);
      border-radius: 7px;
      background-color: var(--bg-input);
      color: var(--text-main);
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s, background-color 0.25s;
    }
    .select-control:focus {
      border-color: var(--border-focus);
    }
    .view-toggle {
      display: flex;
      border: 1px solid var(--border-input);
      border-radius: 7px;
      overflow: hidden;
      background: var(--bg-surface-subtle);
    }
    .toggle-btn {
      background: transparent;
      border: none;
      padding: 0.45rem 0.65rem;
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      transition: background 0.15s, color 0.15s;
    }
    .toggle-btn.active {
      background: var(--bg-surface);
      color: #4f46e5;
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .btn-reset {
      font-size: 0.8rem;
      font-weight: 600;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      padding: 0.42rem 0.75rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-reset:hover {
      background: rgba(239, 68, 68, 0.2);
    }
  `]
})
export class TaskFiltersComponent {
  filters = input.required<TaskFilterOptions>();
  viewMode = input<'board' | 'list'>('board');

  filterChanged = output<Partial<TaskFilterOptions>>();
  viewModeChange = output<'board' | 'list'>();
  resetFilters = output<void>();

  hasActiveFilters(): boolean {
    const f = this.filters();
    return !!(f.search || f.status || f.priority || f.sortBy !== 'createdAt');
  }

  onSearchChange(value: string): void {
    this.filterChanged.emit({ search: value });
  }

  updateFilter(key: keyof TaskFilterOptions, value: any): void {
    this.filterChanged.emit({ [key]: value });
  }
}
