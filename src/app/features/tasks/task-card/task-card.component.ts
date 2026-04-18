import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskModel, TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: TaskModel;
  @Output() onEdit = new EventEmitter<TaskModel>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onStatusChange = new EventEmitter<{ id: string; status: TaskStatus }>();

  private readonly statusOrder: TaskStatus[] = ['todo', 'in_progress', 'done'];

  get statusLabel(): string {
    switch (this.task.status) {
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return 'Todo';
    }
  }

  get statusClass(): string {
    return `status-${this.task.status}`;
  }

  get priorityClass(): string {
    return `priority-${this.task.priority}`;
  }

  get dueText(): string {
    if (!this.task.dueDate) {
      return 'No due date';
    }

    const dueDate = new Date(this.task.dueDate);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();

    if (this.task.isOverdue || diff < 0) {
      return 'Overdue';
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Due today' : `Due in ${days} day${days === 1 ? '' : 's'}`;
  }

  toggleStatus(): void {
    const currentIndex = this.statusOrder.indexOf(this.task.status);
    const nextIndex = (currentIndex + 1) % this.statusOrder.length;
    this.onStatusChange.emit({ id: this.task._id, status: this.statusOrder[nextIndex] });
  }

  editTask(): void {
    this.onEdit.emit(this.task);
  }

  deleteTask(): void {
    this.onDelete.emit(this.task._id);
  }
}
