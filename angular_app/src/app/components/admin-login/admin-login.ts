import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-lg" style="width: 100%; max-width: 400px;">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <h2 class="fw-bold text-primary">Admin Login</h2>
            <p class="text-muted">VehicleQ Admin Panel</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="mb-3">
              <label for="username" class="form-label fw-semibold">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                [(ngModel)]="username"
                required
                placeholder="Enter admin username"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label fw-semibold">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                placeholder="Enter admin password"
              />
            </div>

            <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2 fw-semibold"
              [disabled]="!loginForm.valid || isLoading"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <div class="text-center mt-3">
            <a routerLink="/login" class="text-decoration-none">Back to User Login</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 15px;
      border: none;
    }
    
    .form-control {
      border-radius: 8px;
      padding: 10px 15px;
    }
    
    .btn-primary {
      border-radius: 8px;
    }
  `]
})
export class AdminLoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.adminLogin(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Invalid admin credentials';
      }
    });
  }
}
