import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<div class="empty-state">{{ message }}</div>`,
  styles: [`
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  padding: var(--space-2xl);
  background: oklch(from var(--color-bg) calc(l - 0.02) c h);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);

  /* Modern typography for clarity */
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 400px;
  margin: var(--space-xl) auto;

  /* Progressive: Subtle entrance animation */
  animation: fadeIn 0.5s var(--ease-smooth) forwards;

  &::before {
    content: '📋'; /* Or use a custom SVG icon here */
    font-size: 3rem;
    margin-block-end: var(--space-md);
    filter: grayscale(1) opacity(0.5);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
  `]
})
export class EmptyStateComponent {
  @Input() message: string = 'No data available';
}
