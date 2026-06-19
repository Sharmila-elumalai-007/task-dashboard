import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

const STORAGE_KEY = 'task_dashboard_tasks';
const THEME_KEY = 'task_dashboard_theme';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks$ = new BehaviorSubject<Task[]>([]);
  private darkMode$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadTheme();
    this.loadFromStorage();
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  get isDarkMode$(): Observable<boolean> { return this.darkMode$.asObservable(); }

  toggleDarkMode(): void {
    const next = !this.darkMode$.value;
    this.darkMode$.next(next);
    localStorage.setItem(THEME_KEY, String(next));
    document.documentElement.classList.toggle('dark-mode', next);
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(THEME_KEY) === 'true';
    this.darkMode$.next(saved);
    document.documentElement.classList.toggle('dark-mode', saved);
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────
  get tasks(): Observable<Task[]> { return this.tasks$.asObservable(); }

  private saveToStorage(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.tasks$.next(JSON.parse(stored));
    } else {
      this.fetchFromApi();
    }
  }

  fetchFromApi(): void {
    const ASSIGNEES = ['Alice Morgan', 'Bob Carter', 'Clara Kim', 'Dan Patel', 'Eva Ross'];
    const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
    const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

    this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos?_limit=20')
      .pipe(
        map(todos => todos.map((t, i) => ({
          id: t.id,
          title: t.title.charAt(0).toUpperCase() + t.title.slice(1),
          status: t.completed ? 'Completed' : STATUSES[i % 2] as TaskStatus,
          priority: PRIORITIES[i % 3],
          assignee: ASSIGNEES[i % 5],
          dueDate: this.randomFutureDate(i),
          description: '',
          createdAt: new Date().toISOString()
        }))),
        tap(tasks => {
          this.tasks$.next(tasks);
          this.saveToStorage(tasks);
        })
      ).subscribe();
  }

  private randomFutureDate(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + (offset % 30) - 5);
    return d.toISOString().split('T')[0];
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const current = this.tasks$.value;
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...current];
    this.tasks$.next(updated);
    this.saveToStorage(updated);
  }

  updateTask(updated: Task): void {
    const tasks = this.tasks$.value.map(t => t.id === updated.id ? updated : t);
    this.tasks$.next(tasks);
    this.saveToStorage(tasks);
  }

  deleteTask(id: number): void {
    const tasks = this.tasks$.value.filter(t => t.id !== id);
    this.tasks$.next(tasks);
    this.saveToStorage(tasks);
  }

  getSnapshot(): Task[] {
    return this.tasks$.value;
  }
}
