import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrls: ['./task-stats.component.scss']
})
export class TaskStatsComponent implements OnChanges {
  @Input() tasks: Task[] = [];

  total = 0;
  pending = 0;
  inProgress = 0;
  completed = 0;
  overdue = 0;

  ngOnChanges(): void {
    const today = new Date().toISOString().split('T')[0];
    this.total = this.tasks.length;
    this.pending = this.tasks.filter(t => t.status === 'Pending').length;
    this.inProgress = this.tasks.filter(t => t.status === 'In Progress').length;
    this.completed = this.tasks.filter(t => t.status === 'Completed').length;
    this.overdue = this.tasks.filter(t => t.dueDate < today && t.status !== 'Completed').length;
  }
}
