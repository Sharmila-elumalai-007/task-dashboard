import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    InputTextModule, DropdownModule, ButtonModule, PaginatorModule,
    TaskCardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();

  searchQuery = '';
  selectedStatus = 'All';
  sortBy: 'dueDate' | 'priority' | 'title' = 'dueDate';

  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  sortOptions = [
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Title', value: 'title' }
  ];

  filtered: Task[] = [];

  // Pagination
  pageSize = 12;
  pageIndex = 0; // 0-based

  get totalItems(): number {
    return this.filtered.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pagedTasks(): Task[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    let result = this.tasks.filter(t => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q);
      const matchesStatus = this.selectedStatus === 'All' || t.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    if (this.sortBy === 'priority') {
      result = result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (this.sortBy === 'dueDate') {
      result = result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (this.sortBy === 'title') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.filtered = result;

    // reset pagination when filters/search/sort change
    this.pageIndex = 0;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  onPageChange(event: { first?: number; rows?: number }): void {
    const rows = event.rows ?? this.pageSize;
    this.pageSize = rows;
    this.pageIndex = Math.floor((event.first ?? 0) / this.pageSize);
  }


  trackById(_: number, t: Task) { return t.id; }
}
