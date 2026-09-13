export type TaskItemStatus = 'Todo' | 'InProgress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: number;
  title: string;
  description?: string | null;
  status: TaskItemStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  status: TaskItemStatus;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  status: TaskItemStatus;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface TaskMetrics {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
}

export interface TaskFilterOptions {
  search: string;
  status: string;
  priority: string;
  sortBy: string;
  descending: boolean;
}
