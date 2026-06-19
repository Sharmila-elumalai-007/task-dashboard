import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, DropdownModule, CalendarModule,
    ButtonModule, InputTextareaModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() editTask: Task | null = null;
  @Output() taskSaved = new EventEmitter<Omit<Task, 'id' | 'createdAt'> | Task>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form) {
      if (this.editTask) {
        this.form.patchValue({
          ...this.editTask,
          dueDate: this.editTask.dueDate ? new Date(this.editTask.dueDate) : null
        });
      } else {
        this.form.reset({ status: 'Pending', priority: 'Medium' });
      }
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      status: ['Pending', Validators.required],
      priority: ['Medium', Validators.required],
      assignee: ['', [Validators.required, Validators.minLength(2)]],
      dueDate: [null, Validators.required],
      description: ['']
    });

    if (this.editTask) {
      this.form.patchValue({
        ...this.editTask,
        dueDate: this.editTask.dueDate ? new Date(this.editTask.dueDate) : null
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const payload = {
      ...value,
      dueDate: value.dueDate instanceof Date
        ? value.dueDate.toISOString().split('T')[0]
        : value.dueDate
    };
    if (this.editTask) {
      this.taskSaved.emit({ ...this.editTask, ...payload });
    } else {
      this.taskSaved.emit(payload);
    }
    if (!this.editTask) this.form.reset({ status: 'Pending', priority: 'Medium' });
  }

  get f() { return this.form.controls; }
  get isEdit() { return !!this.editTask; }

  fieldError(field: string): string | null {
    const ctrl = this.form.get(field);
    if (!ctrl?.touched || ctrl.valid) return null;
    if (ctrl.errors?.['required']) return `${this.fieldLabel(field)} is required.`;
    if (ctrl.errors?.['minlength']) return `Too short.`;
    if (ctrl.errors?.['maxlength']) return `Too long (max 120 chars).`;
    return 'Invalid value.';
  }

  private fieldLabel(field: string): string {
    const map: Record<string, string> = {
      title: 'Title', status: 'Status', priority: 'Priority',
      assignee: 'Assignee', dueDate: 'Due date'
    };
    return map[field] ?? field;
  }
}
