import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject, BehaviorSubject, switchMap, startWith, catchError, of, map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { TaskModel, TaskQueryParams, TaskPriority, TaskStatus, TaskStats, TaskPagination } from '../../../core/models/task.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, TaskFormComponent, EmptyStateComponent, SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  taskService = inject(TaskService);
  destroyRef = inject(DestroyRef);

  filters = signal<TaskQueryParams>({ page: 1, limit: 10 });
  showTaskForm = signal(false);
  editingTask = signal<TaskModel | null>(null);
  stats = signal<TaskStats>({ todo: 0, in_progress: 0, done: 0 });
  tasks = signal<TaskModel[]>([]);
  loading = signal<boolean>(false);
  pagination = signal<TaskPagination>({ page: 1, totalPages: 1, totalCount: 0 });
  private search$ = new Subject<string>();

  statusOptions: Array<{ value: TaskStatus | ''; label: string }> = [
    { value: '', label: 'All' },
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  priorityOptions = [
    { value: '', label: 'All priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  ngOnInit(): void {
    if (this.authService.user() === null) {
      this.authService.getCurrentUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    this.loadTasks();
    this.loadStats();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks(this.filters()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: ({ tasks, pagination }) => {
        this.tasks.set(tasks);
        console.log("this.tasks", tasks);
        this.pagination.set(pagination);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks.set([]);
        this.pagination.set({ page: 1, totalPages: 1, totalCount: 0 });
      }
    });
  }

  constructor() {
    effect(() => {
      this.filters();
      this.loadTasks();
    }, { allowSignalWrites: true });

    this.search$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        this.filters.update((current) => ({ ...current, search, page: 1 }));
      });
  }

  onSearch(value: string): void {
    this.search$.next(value.trim());
  }

  openNewTask(): void {
    this.editingTask.set(null);
    this.showTaskForm.set(true);
  }

  editTask(task: TaskModel): void {
    this.editingTask.set(task);
    this.showTaskForm.set(true);
  }

  handleSaved(): void {
    this.showTaskForm.set(false);
    this.loadTasks();
    this.loadStats();
  }

  handleCancelled(): void {
    this.showTaskForm.set(false);
  }

  deleteTask(taskId: string): void {
    if (!confirm('Delete this task?')) {
      return;
    }

    this.taskService.deleteTask(taskId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.tasks().length === 0 && this.pagination().page > 1) {
        this.filters.update((current) => ({ ...current, page: (current.page ?? 1) - 1 }));
      }
      this.loadTasks();
      this.loadStats();
    });
  }

  changeTaskStatus(event: { id: string; status: TaskStatus }): void {
    this.taskService.updateStatus(event.id, event.status).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  prevPage(): void {
    if (this.pagination().page > 1) {
      this.filters.update((current) => ({ ...current, page: (current.page ?? 1) - 1 }));
    }
  }

  nextPage(): void {
    const pagination = this.pagination();
    if (pagination.page < pagination.totalPages) {
      this.filters.update((current) => ({ ...current, page: (current.page ?? 1) + 1 }));
    }
  }

  getStatusFilter(): TaskStatus | undefined {
    return this.filters().status;
  }

  setStatusFilter(status: string): void {
    this.filters.update((current) => ({
      ...current,
      status: status === '' ? undefined : (status as TaskStatus),
      page: 1
    }));
  }

  setPriorityFilter(priority: string): void {
    this.filters.update((current) => ({
      ...current,
      priority: priority === '' ? undefined : (priority as TaskPriority),
      page: 1
    }));
  }

  logout(): void {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private loadStats(): void {
    this.taskService.getStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (stats) => {
        console.log('Stats received:', stats);
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Keep default values if there's an error
        this.stats.set({ todo: 0, in_progress: 0, done: 0 });
      }
    });
  }

  trapDialogFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.showTaskForm()) {
      return;
    }

    const container = event.currentTarget as HTMLElement;
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('disabled'));

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }
}
