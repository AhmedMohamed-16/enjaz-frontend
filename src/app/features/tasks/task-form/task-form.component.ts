import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TaskModel, TaskPriority, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: TaskModel | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  loading = false;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['todo', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: ['']
  });

  statusOptions: Array<{ value: TaskStatus; label: string }> = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  priorityOptions: Array<{ value: TaskPriority; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  minDueDate = this.getTodayDateString();

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.patchForm();
    }
  }

  get titleControl() {
    return this.taskForm.get('title');
  }

  get isEditMode(): boolean {
    return !!this.task;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.taskForm.value as {
      title: string;
      description?: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate?: string;
    };

    const payload: CreateTaskDto | UpdateTaskDto = {
      title: formValue.title,
      description: formValue.description || undefined,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate || undefined
    };

    const action = this.task
      ? this.taskService.updateTask(this.task._id, payload)
      : this.taskService.createTask(payload);

    action.pipe(finalize(() => this.loading = false)).subscribe({
      next: () => this.saved.emit(),
      error: () => {
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private patchForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description ?? '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate ?? ''
      });
      return;
    }

    this.taskForm.reset({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: ''
    });
  }

  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
