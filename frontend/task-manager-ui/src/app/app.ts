import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TaskDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  taskService = inject(TaskService);

  @ViewChild('dashboard') dashboard!: TaskDashboardComponent;

  handleOpenCreate(): void {
    if (this.dashboard?.modal) {
      this.dashboard.modal.openCreate();
    }
  }
}
