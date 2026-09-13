import {
  Component,
  ElementRef,
  ViewChild,
  output,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  TaskItem,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskItemStatus,
  TaskPriority
} from '../../models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <dialog #dialogRef class="task-dialog" (click)="onBackdropClick($event)">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3 class="dialog-title">
            {{ isEditMode() ? 'Edit Task' : 'Create New Task' }}
          </h3>
          <button class="close-btn" (click)="closeModal()" aria-label="Close dialog">
            &times;
          </button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="dialog-form">
          <!-- Title Field -->
          <div class="form-group">
            <label for="taskTitle" class="form-label">
              Task Title <span class="required">*</span>
            </label>
            <input
              id="taskTitle"
              type="text"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('title')"
              formControlName="title"
              placeholder="e.g. Implement user authentication"
              maxlength="150"
            />
            @if (isFieldInvalid('title')) {
              <div class="field-error">
                Title is required (between 2 and 150 characters).
              </div>
            }
          </div>

          <!-- Description Field -->
          <div class="form-group">
            <label for="taskDesc" class="form-label">Description</label>
            <textarea
              id="taskDesc"
              rows="3"
              class="form-control"
              formControlName="description"
              placeholder="Add details or context for this task..."
              maxlength="1000"
            ></textarea>
          </div>

          <!-- Status and Priority Grid -->
          <div class="form-row">
            <div class="form-group col">
              <label for="taskStatus" class="form-label">Status</label>
              <select id="taskStatus" class="form-control" formControlName="status">
                <option value="Todo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div class="form-group col">
              <label for="taskPriority" class="form-label">Priority</label>
              <select id="taskPriority" class="form-control" formControlName="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <!-- Due Date Field -->
          <div class="form-group">
            <label for="taskDueDate" class="form-label">Due Date</label>
            <input
              id="taskDueDate"
              type="date"
              class="form-control"
              formControlName="dueDate"
            />
          </div>

          <!-- Actions -->
          <div class="dialog-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="taskForm.invalid || isSubmitting()"
            >
              {{ isSubmitting() ? 'Saving...' : (isEditMode() ? 'Save Changes' : 'Create Task') }}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  `,
  styles: [`
    .task-dialog {
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 0;
      background: transparent;
      max-width: 520px;
      width: 90vw;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .task-dialog::backdrop {
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
    }
    .dialog-content {
      background: var(--bg-surface);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: background-color 0.25s ease;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    .dialog-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }
    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.15s;
    }
    .close-btn:hover {
      color: var(--text-main);
    }
    .dialog-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .col {
      flex: 1;
    }
    .form-label {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .required {
      color: #ef4444;
    }
    .form-control {
      padding: 0.6rem 0.85rem;
      font-size: 0.875rem;
      border: 1px solid var(--border-input);
      border-radius: 8px;
      outline: none;
      background: var(--bg-input);
      color: var(--text-main);
      transition: border-color 0.15s, box-shadow 0.15s, background-color 0.25s;
    }
    .form-control:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .form-control.is-invalid {
      border-color: #ef4444;
    }
    .field-error {
      font-size: 0.75rem;
      color: #ef4444;
      font-weight: 500;
    }
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 0.75rem;
      margin-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }
    .btn {
      padding: 0.6rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease-in-out;
    }
    .btn-secondary {
      background: var(--bg-surface-subtle);
      color: var(--text-muted);
    }
    .btn-secondary:hover {
      background: var(--border-color);
      color: var(--text-main);
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class TaskModalComponent {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

  private fb = inject(FormBuilder);

  saveTask = output<{ isEdit: boolean; id?: number; data: CreateTaskRequest | UpdateTaskRequest }>();

  isEditMode = signal<boolean>(false);
  editingTaskId = signal<number | null>(null);
  isSubmitting = signal<boolean>(false);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: [''],
    status: ['Todo' as TaskItemStatus, Validators.required],
    priority: ['Medium' as TaskPriority, Validators.required],
    dueDate: ['']
  });

  openCreate(): void {
    this.isEditMode.set(false);
    this.editingTaskId.set(null);
    this.taskForm.reset({
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: ''
    });
    this.dialogRef.nativeElement.showModal();
  }

  openEdit(task: TaskItem): void {
    this.isEditMode.set(true);
    this.editingTaskId.set(task.id);

    let formattedDate = '';
    if (task.dueDate) {
      formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
    }

    this.taskForm.setValue({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: formattedDate
    });
    this.dialogRef.nativeElement.showModal();
  }

  closeModal(): void {
    this.dialogRef.nativeElement.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef.nativeElement) {
      this.closeModal();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.taskForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formVal = this.taskForm.value;
    const taskPayload: CreateTaskRequest | UpdateTaskRequest = {
      title: formVal.title.trim(),
      description: formVal.description ? formVal.description.trim() : null,
      status: formVal.status,
      priority: formVal.priority,
      dueDate: formVal.dueDate ? new Date(formVal.dueDate).toISOString() : null
    };

    this.saveTask.emit({
      isEdit: this.isEditMode(),
      id: this.editingTaskId() ?? undefined,
      data: taskPayload
    });

    this.closeModal();
  }
}
