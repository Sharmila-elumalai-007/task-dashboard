import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, TooltipModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  get statusSeverity(): 'success' | 'info' | 'warning' | 'danger' {
    const map: Record<string, any> = {
      'Completed': 'success',
      'In Progress': 'info',
      'Pending': 'warning'
    };
    return map[this.task.status] ?? 'warning';
  }

  get prioritySeverity(): 'success' | 'info' | 'warning' | 'danger' {
    const map: Record<string, any> = {
      'High': 'danger', 'Medium': 'warning', 'Low': 'success'
    };
    return map[this.task.priority] ?? 'info';
  }

  get isOverdue(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.task.dueDate < today && this.task.status !== 'Completed';
  }

  get avatarInitials(): string {
    return this.task.assignee
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
