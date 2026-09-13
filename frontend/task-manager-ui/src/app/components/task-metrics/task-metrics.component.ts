import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMetrics } from '../../models/task.model';

@Component({
  selector: 'app-task-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metrics-grid">
      <!-- Total Tasks Card -->
      <div class="metric-card" (click)="filterChanged.emit({ status: '', priority: '' })">
        <div class="metric-header">
          <span class="metric-label">Total Tasks</span>
          <div class="icon-bubble icon-blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
        </div>
        <div class="metric-value">{{ metrics()?.totalTasks ?? 0 }}</div>
        <div class="metric-subtext">Click to view all</div>
      </div>

      <!-- In Progress Card -->
      <div class="metric-card" (click)="filterChanged.emit({ status: 'InProgress', priority: '' })">
        <div class="metric-header">
          <span class="metric-label">In Progress</span>
          <div class="icon-bubble icon-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
        <div class="metric-value">{{ metrics()?.inProgressTasks ?? 0 }}</div>
        <div class="metric-subtext">Active assignments</div>
      </div>

      <!-- Completed Card -->
      <div class="metric-card" (click)="filterChanged.emit({ status: 'Completed', priority: '' })">
        <div class="metric-header">
          <span class="metric-label">Completed</span>
          <div class="icon-bubble icon-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        <div class="metric-value">{{ metrics()?.completedTasks ?? 0 }}</div>
        <div class="metric-subtext">Done & resolved</div>
      </div>

      <!-- High Priority Card -->
      <div class="metric-card" (click)="filterChanged.emit({ status: '', priority: 'High' })">
        <div class="metric-header">
          <span class="metric-label">High Priority</span>
          <div class="icon-bubble icon-rose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>
        <div class="metric-value">{{ metrics()?.highPriorityTasks ?? 0 }}</div>
        <div class="metric-subtext">Requires attention</div>
      </div>

      <!-- Overdue Card -->
      <div class="metric-card" [class.highlight-warning]="(metrics()?.overdueTasks ?? 0) > 0">
        <div class="metric-header">
          <span class="metric-label">Overdue</span>
          <div class="icon-bubble icon-red">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
        <div class="metric-value">{{ metrics()?.overdueTasks ?? 0 }}</div>
        <div class="metric-subtext">Passed due date</div>
      </div>
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    .metric-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.1rem 1.25rem;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.25s ease;
      box-shadow: var(--card-shadow);
    }
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-hover-shadow);
      border-color: var(--border-focus);
    }
    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.6rem;
    }
    .metric-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .icon-bubble {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-blue { background: rgba(37, 99, 235, 0.15); color: #3b82f6; }
    .icon-amber { background: rgba(217, 119, 6, 0.15); color: #f59e0b; }
    .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .icon-rose { background: rgba(225, 29, 72, 0.15); color: #f43f5e; }
    .icon-red { background: rgba(220, 38, 38, 0.15); color: #ef4444; }

    .metric-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .metric-subtext {
      font-size: 0.75rem;
      color: var(--text-subtle);
      margin-top: 0.35rem;
    }
    .highlight-warning {
      border-color: rgba(239, 68, 68, 0.5);
    }
  `]
})
export class TaskMetricsComponent {
  metrics = input<TaskMetrics | null>(null);
  filterChanged = output<{ status: string; priority: string }>();
}
