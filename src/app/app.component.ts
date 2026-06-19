import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { HeaderComponent } from './components/header/header.component';
import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AiChatbotComponent } from './components/ai-chatbot/ai-chatbot.component';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet,
    ConfirmDialogModule, ToastModule, DialogModule,
    HeaderComponent, TaskStatsComponent, TaskFormComponent,
    TaskListComponent, AiChatbotComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  isDark$!: Observable<boolean>;
  editingTask: Task | null = null;
  editDialogVisible = false;

  constructor(
    private taskService: TaskService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks;
    this.isDark$ = this.taskService.isDarkMode$;
  }

  onTaskSaved(task: any): void {
    if (task.id) {
      this.taskService.updateTask(task);
      this.messageService.add({ severity: 'success', summary: 'Task updated', detail: task.title, life: 3000 });
    } else {
      this.taskService.addTask(task);
      this.messageService.add({ severity: 'success', summary: 'Task added', detail: task.title, life: 3000 });
    }
    this.editingTask = null;
    this.editDialogVisible = false;
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.editDialogVisible = true;
  }

  onDeleteTask(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      header: 'Delete Task',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.taskService.deleteTask(id);
        this.messageService.add({ severity: 'warn', summary: 'Task deleted', life: 2500 });
      }
    });
  }

  closeEditDialog(): void {
    this.editingTask = null;
    this.editDialogVisible = false;
  }
}
