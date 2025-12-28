import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  fullName = '';
  phone = '';

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.fullName = user.full_name;
      this.phone = user.phone;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      const user = this.authService.currentUserValue;
      if (user) {
        this.fullName = user.full_name;
        this.phone = user.phone;
      }
    }
  }

  updateProfile(): void {
    const user = this.authService.currentUserValue;
    if (!user) return;

    this.apiService.updateProfile(user.id, this.fullName, this.phone).subscribe({
      next: (updatedUser) => {
        this.authService.updateCurrentUser(updatedUser);
        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        alert('Failed to update profile: ' + error.message);
      }
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
