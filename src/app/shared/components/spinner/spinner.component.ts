import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `<div class="spinner">Loading...</div>`,
  styles: [`
   /* spinner.component.scss */
:host {
  display: grid;
  place-items: center;
  padding: var(--space-2xl);
  width: 100%;
}

.spinner {
  /* Using color-mix to create a faint track for the spinner */
  --spinner-track: oklch(from var(--color-primary) l c h / 10%);

  width: 48px;
  aspect-ratio: 1;
  border-radius: 50%;

  /* Progressive: Use a conic gradient for a high-end "shimmer" effect */
  background: radial-gradient(farthest-side, var(--color-primary) 94%, #0000) top/8px 8px no-repeat,
              conic-gradient(#0000 30%, var(--color-primary));

  /* Masking creates the hollow ring effect */
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);

  animation: spin 1s infinite linear;
}

/* GPU Accelerated animation */
@keyframes spin {
  100% { transform: rotate(1turn); }
}

/* Fallback for screen readers */
.spinner::after {
  content: 'Loading your workspace...';
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
  `]
})
export class SpinnerComponent {}
