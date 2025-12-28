import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  fullName = '';
  phone = '';
  obscurePassword = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.authService.register(
      this.username, 
      this.email, 
      this.password, 
      this.fullName, 
      this.phone
    ).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(): void {
    this.obscurePassword = !this.obscurePassword;
  }
}
