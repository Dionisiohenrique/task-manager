import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <div class="brand">
          <div class="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
              <path d="M7 7h.01"></path>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">TaskFlow</span>
            <span class="brand-badge">Angular + .NET 10</span>
          </div>
        </div>

        <div class="nav-actions">
          <!-- Dark / Light Theme Toggle -->
          <button
            class="btn-theme-toggle"
            (click)="themeService.toggleTheme()"
            [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            aria-label="Toggle theme"
          >
            @if (themeService.isDark()) {
              <!-- Sun Icon for Light mode switch -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            } @else {
              <!-- Moon Icon for Dark mode switch -->
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            }
          </button>

          <!-- New Task Button -->
          <button class="btn btn-primary" (click)="openCreateModal.emit()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .logo-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
    }
    .brand-text {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }
    .brand-badge {
      font-size: 0.72rem;
      font-weight: 600;
      color: #4f46e5;
      background: rgba(79, 70, 229, 0.1);
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      border: 1px solid rgba(79, 70, 229, 0.2);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-theme-toggle {
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }
    .btn-theme-toggle:hover {
      background: var(--border-color);
      transform: scale(1.05);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 1.15rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      border: none;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }
    .btn-primary:hover {
      background: #4338ca;
      box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
      transform: translateY(-1px);
    }
  `]
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  openCreateModal = output<void>();
}
